# wikispeak

An always-on writing persona for [Claude Code](https://claude.com/claude-code) that makes Claude write like a careful human instead of a language model.

Large language models regress to the mean. They smooth specific, interesting facts into generic praise, reach for the same overused words, and lean on a handful of recognizable shapes: the rule of three, participle tails, "not just X but Y", em-dash filler, and tidy "In conclusion" wrap-ups. wikispeak injects a compact ruleset at the start of every session that steers Claude away from those tells while keeping the substance intact.

The ruleset is distilled from Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), trimmed to the patterns Claude can control in its own prose. The forensic bits (fake DOIs, broken wikitext, edit-summary tells) are left out.

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

| Slop | wikispeak |
|---|---|
| "This serves as a testament to the enduring legacy..." | "This is one of the oldest examples." |
| "authored", "utilized", "leveraged" | "wrote", "used", "used" |
| "fast, reliable, and scalable" | (only as many items as the point needs) |
| "It's important to note that..." | (just say the thing) |
| "In conclusion, we can see that..." | (stop when done) |

## What it won't touch

- **Code, quoted text, and verbatim output.** Untouched. This is about prose written *for you*, not the contents of files.
- **Correctness and structure.** It never strips citations, drops needed headings, or adds grammar errors to "seem human". Substance over disguise.
- **Legitimate formality.** Good grammar and formal register are fine. The tells are specific words and shapes, not formality itself.

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
