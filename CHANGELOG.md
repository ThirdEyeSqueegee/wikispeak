# Changelog

## 0.3.0

- Added a `## Persistence` section to the persona, matching the shape of
  sibling personas (caveman, ponytail). It states the persona is active every
  response and every rule always applies, with anti-drift lines so the persona
  holds across long sessions and context compaction instead of relapsing into
  slop. The on/off toggle stays in Boundaries.

## 0.2.0

- Coexist with terseness personas like caveman. wikispeak now declares its
  axis as word and shape choice, not length or register: it yields register
  to an active terseness persona and keeps its vocab and structure rules
  underneath, so the two no longer fight. Retuned the per-turn reminder to
  match.
- Reframed the README and plugin descriptions around the benefit (tight,
  precise prose that gets to the point) rather than avoiding AI-speak.

## 0.1.0

Initial release.

- SessionStart hook injects the persona from `skills/wikispeak/SKILL.md` every
  session; UserPromptSubmit hook re-anchors it each turn and handles the
  on/off toggle.
- Persona ruleset distilled from Wikipedia:Signs of AI writing, covering prose
  tells (vocab pile-up, puffery, participle tails, rule of three, negative
  parallelism, copula dodge, elegant variation, wordy circumlocution, weasel
  attribution, notability-hammering, canned closers, hedge-disclaimers,
  service filler) and formatting tells (boldface, title case, inline-header
  lists, small tables, spaced em dashes, curly quotes, placeholders, markdown
  dumping).
- Toggle: "stop wikispeak" / "normal mode" off; "/wikispeak" / "wikispeak
  mode" on. State persists across sessions via a flag file.
- Optional statusline segment in `statusline/wikispeak-statusline.sh`.
- Self-reviewed against the source guide so the ruleset does not commit the
  tells it bans.
