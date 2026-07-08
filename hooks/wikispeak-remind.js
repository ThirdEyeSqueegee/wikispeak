#!/usr/bin/env node
// wikispeak — UserPromptSubmit hook.
// Two jobs:
//  1. Detect on/off triggers in the prompt and flip the flag file (so the
//     choice survives into the next SessionStart).
//  2. Re-anchor a one-line reminder every turn via additionalContext, so the
//     persona survives context compaction and competing plugin instructions.
// Per-turn context uses the STRUCTURED channel (hookSpecificOutput), not raw
// stdout — that is the documented way to add UserPromptSubmit context.

const fs = require('fs');
const path = require('path');
const os = require('os');

process.stdin.on('error', () => {});

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.wikispeak-off');

function readPrompt() {
  try {
    const raw = fs.readFileSync(0, 'utf8');            // stdin
    return (JSON.parse(raw).prompt || '').toLowerCase();
  } catch (e) { return ''; }
}

const prompt = readPrompt();

// toggle detection
if (/\b(stop wikispeak|normal mode|wikispeak off)\b/.test(prompt)) {
  try { fs.writeFileSync(flagPath, 'off'); } catch (e) {}
  process.exit(0);
}
if (/\b(wikispeak on|wikispeak mode|\/wikispeak)\b/.test(prompt)) {
  try { fs.unlinkSync(flagPath); } catch (e) {}
}

let off = false;
try { off = fs.readFileSync(flagPath, 'utf8').trim() === 'off'; } catch (e) {}
if (off) process.exit(0);

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: 'WIKISPEAK MODE ACTIVE. Word and shape choice, not length: at whatever register is active (follow a terseness persona like caveman if present), avoid AI vocab pile-ups, puffery, rule-of-three, participle tails, negative parallelism, em-dash filler, and canned closers. Code and verbatim output untouched.'
  }
}));
process.exit(0);
