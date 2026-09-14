// Rewrites data/events.json from Meetup, once a day (see .github/workflows/refresh-events.yml).
// Node 20+. Only dependency: node-ical.
import { readFile, writeFile } from 'node:fs/promises';
import ical from 'node-ical';

const SLUG = 'ux-hub-barcelona';
const ICAL_URL = `https://www.meetup.com/${SLUG}/events/ical/`;
const GROUP_URL = `https://www.meetup.com/${SLUG}/`;
const OUT = 'data/events.json';
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; uxhubbcn-site-refresh/1.0)' };

const prev = JSON.parse(await readFile(OUT, 'utf8'));

// ---- 1. next upcoming event from the iCal feed -------------------------------
async function nextEvent() {
  const res = await fetch(ICAL_URL, { headers: UA });
  if (!res.ok) throw new Error(`iCal ${res.status}`);
  const parsed = ical.parseICS(await res.text());
  const now = Date.now();
  const upcoming = Object.values(parsed)
    .filter(e => e.type === 'VEVENT' && e.start)
    .map(e => ({ e, end: (e.end || new Date(+e.start + 3 * 3600e3)) }))
    .filter(x => +x.end > now)
    .sort((a, b) => +a.e.start - +b.e.start)[0];
  if (!upcoming) return null;
  const { e, end } = upcoming;
  const [venue, ...rest] = String(e.location || '').split(',');
  return {
    title: String(e.summary || '').trim(),
    start: new Date(e.start).toISOString(),
    end: new Date(end).toISOString(),
    venue: (venue || '').trim(),
    city: rest.join(',').trim() || 'Barcelona',
    // iCal carries no price/format/speakers — keep whatever is curated by hand.
    price: prev.event?.price ?? 'Free · drinks & snacks included',
    format: prev.event?.format,
    speakers: prev.event?.speakers ?? [],
    description: String(e.description || '').split('\n\n')[0].trim(),
    rsvpUrl: String(e.url || GROUP_URL),
    uid: String(e.uid || '')
  };
}

// ---- 2. cover image: og:image on the event page ------------------------------
async function coverImage(ev) {
  if (!ev?.rsvpUrl) return prev.event?.image;
  try {
    const html = await (await fetch(ev.rsvpUrl, { headers: UA })).text();
    const url = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1];
    if (!url) return prev.event?.image;
    const bytes = Buffer.from(await (await fetch(url, { headers: UA })).arrayBuffer());
    // Never hotlink meetupstatic.com — those URLs rotate. Store it locally.
    const id = (ev.uid || String(Date.now())).replace(/[^a-z0-9]/gi, '').slice(0, 24);
    const path = `assets/event-cover-${id}.jpg`;
    await writeFile(path, bytes);
    return path;
  } catch { return prev.event?.image; }   // keep the previous image rather than blanking it
}

// ---- 3. group stats, for the sponsors page -----------------------------------
async function stats() {
  try {
    const html = await (await fetch(GROUP_URL, { headers: UA })).text();
    const members = html.match(/"memberCount"\s*:\s*(\d+)/)?.[1];
    const rating  = html.match(/"ratingValue"\s*:\s*"?([\d.]+)/)?.[1];
    const count   = html.match(/"ratingCount"\s*:\s*"?(\d+)/)?.[1];
    return {
      members: members ? Number(members) : prev.stats?.members,
      rating: rating ? Number(rating) : prev.stats?.rating,
      ratingCount: count ? Number(count) : prev.stats?.ratingCount,
      capturedAt: new Date().toISOString()
    };
  } catch { return prev.stats; }
}

const event = await nextEvent();
if (event) event.image = await coverImage(event);

const out = {
  _comment: prev._comment,
  updated: new Date().toISOString(),
  source: GROUP_URL + 'events/',
  event,
  // When nothing is scheduled, the last known event is kept for reference.
  lastEvent: event ? (prev.event ?? prev.lastEvent ?? null) : (prev.event ?? prev.lastEvent ?? null),
  stats: await stats()
};

await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');

// ---- 4. keep the HTML fallbacks in step with the fetched numbers ------------
// Both pages hardcode the last known figures so they render before (or without)
// the fetch. Rewriting them here stops the markup drifting from the live data.
async function syncFallbacks(stats) {
  if (!stats?.members) return;
  const members = stats.members.toLocaleString('en-GB');
  const rounded = (Math.floor(stats.members / 100) * 100).toLocaleString('en-GB');
  const edits = [
    ['sponsors.html', [
      [/(<dd id="stat-members">)[^<]*/, `$1${members}`],
      [/(id="stat-rating">)[\d.]+ /, `$1${stats.rating} `],
      [/(id="stat-rating-sub">from )[\d,]+( ratings)/, `$1${(stats.ratingCount ?? 0).toLocaleString('en-GB')}$2`]
    ]],
    ['index.html', [
      [/(<div class="n" id="about-members">)[\d,]*/, `$1${rounded}`]
    ]]
  ];
  for (const [file, rules] of edits) {
    let html = await readFile(file, 'utf8');
    for (const [re, to] of rules) html = html.replace(re, to);
    await writeFile(file, html);
  }
}
await syncFallbacks(out.stats);

console.log(event ? `Next: ${event.title} (${event.start})` : 'No upcoming event.');
console.log(out.stats ? `Stats: ${out.stats.members} members, ${out.stats.rating} (${out.stats.ratingCount})` : 'No stats.');
