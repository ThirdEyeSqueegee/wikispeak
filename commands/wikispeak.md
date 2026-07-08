---
description: Toggle wikispeak writing mode on/off
---

wikispeak is an always-on writing persona (injected each session by a
SessionStart hook). This command is a manual toggle.

- Turn on: say "wikispeak on" (or just `/wikispeak`) — clears the off flag; full
  effect next session, reminder active this turn.
- Turn off: say "stop wikispeak" or "normal mode".

The full ruleset lives in `skills/wikispeak/SKILL.md` and is the single source
of truth. Edit it there to tune the persona.
