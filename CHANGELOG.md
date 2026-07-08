# Changelog

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
