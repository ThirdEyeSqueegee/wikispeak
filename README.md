# wikispeak

An always-on writing persona for [Claude Code](https://claude.com/claude-code) that keeps Claude's prose tight: get to the point, use precise words, skip the padding.

Left alone, model prose tends to inflate. It pads a simple fact with generic praise, reaches for a stock set of fancy words (delve, pivotal, testament to), stacks everything in threes, and winds down with an "In conclusion" that repeats what it just said. The result reads longer than it is and buries the point. wikispeak injects a compact ruleset at the start of every session that cuts the padding and keeps the substance: say the specific thing, in plain words, once.

The ruleset is distilled from Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), a catalogue of the exact phrasings and structures that signal padded prose, trimmed to the patterns Claude can control in its own writing.

## How it works

wikispeak is a plugin with two hooks. There is no command to remember to run; it is on by default.

- **SessionStart** runs `hooks/wikispeak-activate.js`, which reads `skills/wikispeak/SKILL.md` and prints it to stdout. Claude Code injects that into the session as hidden context. That single write is the whole always-on mechanism.
- **UserPromptSubmit** runs `hooks/wikispeak-remind.js`, which re-anchors a one-line reminder every turn (so the persona survives context compaction and competing instructions) and watches for on/off phrases.

`skills/wikispeak/SKILL.md` is the single source of truth. Edit it to tune the persona; both hooks read from it.

## Install

```
/plugin marketplace add ThirdEyeSqueegee/wikispeak
/plugin install wikispeak@wikispeak
```

Then start a new session so the SessionStart hook fires.

**Manual alternative.** Copy the two hooks into `~/.claude/settings.json` under `"hooks"` (SessionStart to `wikispeak-activate.js`, UserPromptSubmit to `wikispeak-remind.js`) and point them at wherever you cloned this repo.

## Usage

It works once installed. To toggle:

| Say this | Effect |
|---|---|
| `stop wikispeak` / `normal mode` | Turn it off (persists across sessions) |
| `wikispeak on` / `/wikispeak` | Turn it back on |

Off state is stored in a flag file (`$CLAUDE_CONFIG_DIR/.wikispeak-off`) so it survives restarts.

## Statusline (optional)

The injected context is hidden, so there is no visible sign wikispeak is on. `statusline/wikispeak-statusline.sh` prints a badge (`[wikispeak]` or `[wikispeak:off]`) by reading the same flag file. It has no dependencies and prints only the badge.

Claude Code's `statusLine` is a single command, not a list. If you have no statusline yet, point it straight at the script:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash /absolute/path/to/wikispeak/statusline/wikispeak-statusline.sh"
  }
}
```

**If you already have a statusline, this does not stack automatically. Pointing `statusLine.command` at the script replaces your current one.** To keep both, call the script from your existing statusline and append its output, for example:

```bash
echo "$(your_existing_statusline) $(bash /path/to/wikispeak/statusline/wikispeak-statusline.sh)"
```

Because the script emits just the badge, it composes cleanly wherever you splice it in.

## What it changes

A few of the shifts it nudges toward:

| Padded | Tight |
|---|---|
| "This serves as a testament to the enduring legacy..." | "This is one of the oldest examples." |
| "authored", "utilized", "leveraged" | "wrote", "used", "used" |
| "fast, reliable, and scalable" | (only as many items as the point needs) |
| "It's important to note that..." | (just say the thing) |
| "In conclusion, we can see that..." | (stop when done) |

## What it won't touch

- **Code, quoted text, and verbatim output.** Untouched. This is about prose written *for you*, not the contents of files.
- **Correctness and structure.** It never strips citations, drops needed headings, or dumbs prose down. Tighter, not lossier.
- **Legitimate formality.** Good grammar and a formal register are fine. The target is padding and vague word choice, not formality itself.

## Layout

```
.claude-plugin/
  plugin.json           # manifest; declares the two hooks inline
  marketplace.json      # marketplace entry (source is repo root)
hooks/
  wikispeak-activate.js # SessionStart: inject the persona
  wikispeak-remind.js   # UserPromptSubmit: re-anchor + on/off toggle
  package.json          # {"type":"commonjs"} so the hooks' require() works
skills/
  wikispeak/SKILL.md    # the persona; single source of truth, edit here
commands/
  wikispeak.md          # /wikispeak toggle
statusline/
  wikispeak-statusline.sh # optional on/off badge
LICENSE                 # MIT (code)
NOTICE                  # CC BY-SA attribution for the ruleset
CHANGELOG.md
```

## License

Code is MIT. The persona ruleset in `skills/wikispeak/SKILL.md` is a derivative of a Wikipedia page and is licensed under CC BY-SA 4.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

## Credit

Mechanism modeled on the [caveman](https://github.com/juliusbrussee/caveman) plugin, which pioneered the SessionStart-hook-as-persona pattern for Claude Code. Ruleset sourced from the Wikipedia editors behind [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).
