# Keeping the homepage event in sync with Meetup

The homepage renders its "Upcoming event" from `data/events.json`. The browser cannot read
meetup.com directly (CORS, and the GraphQL API needs a server-side OAuth token), so a small
scheduled job has to write that file.

**Group slug: `ux-hub-barcelona`.** (An earlier version of this doc said `ux-salon-barcelona`,
which does not exist and would have failed on the first run.)

## The job, once a day

1. **Fetch the iCal feed** — `https://www.meetup.com/ux-hub-barcelona/events/ical/`
   No auth required. Parse with any ICS library (`node-ical`, `ical.js`).
2. **Take the first VEVENT whose `DTEND` is in the future.** Map it:

   | events.json | iCal field |
   |---|---|
   | `title` | `SUMMARY` |
   | `start` / `end` | `DTSTART` / `DTEND` (keep the `+01:00`/`+02:00` offset) |
   | `venue` / `city` | `LOCATION` (split on the first comma) |
   | `description` | `DESCRIPTION`, strip the Meetup boilerplate footer |
   | `rsvpUrl` | `URL` |

   iCal carries no image, price, format or speakers. `price`, `format` and `speakers` stay
   manually curated in this file between runs; `image` comes from step 3.
3. **Scrape the cover image** from the event page at `rsvpUrl`: request the HTML and read
   `<meta property="og:image">`. Download it to `assets/event-cover-<eventId>.jpg` and set
   `image` to that path. Never hotlink meetupstatic.com — those URLs rotate.
   If the scrape fails, leave the previous `image` value rather than writing an empty one.
4. **If no future VEVENT exists, write `"event": null`** and move the previous event into
   `lastEvent`. The homepage hides its events section when `event` is null.
5. **Rewrite the HTML fallbacks.** Both pages hardcode the last known figures so the
   numbers render before the fetch resolves (and if it fails). The script patches
   `sponsors.html` (members, rating, rating count) and the about figure in
   `UX Hub Barcelona.html` (rounded down to the nearest 100, so the "+" stays true),
   keeping markup and live data in step.
6. Set `updated` to the run timestamp and commit the changed files.

## Failure behaviour

The page has two independent guards, so a broken job degrades quietly:

- If the fetch fails, the event baked into the HTML is used.
- `isUpcoming()` checks the date on every render. A past event is never shown as "Upcoming" —
  the section hides itself, the "Next event" nav buttons disappear, and the hero CTA switches
  to "Follow us on Meetup". Nav "Events" always links straight to Meetup.

## Recommended host

GitHub Actions cron is the simplest fit, since the output is a commit to this repo.
Vercel Cron, a Cloudflare Worker or a Netlify scheduled function all work equally well.
