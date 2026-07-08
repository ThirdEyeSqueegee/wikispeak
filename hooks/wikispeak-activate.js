#!/usr/bin/env node
// wikispeak — SessionStart hook.
// Whatever this prints to stdout is injected into the session as hidden
// context every session start. That single write IS the always-on mechanism.
// SKILL.md is the single source of truth; we read it at runtime and echo it.

const fs = require('fs');
const path = require('path');
const os = require('os');

// never let a hook error block session start
process.stdin.on('error', () => {});

function readSkill() {
  const root = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
  const candidates = [
    path.join(root, 'skills', 'wikispeak', 'SKILL.md'),
    path.join(__dirname, '..', 'skills', 'wikispeak', 'SKILL.md'),
  ];
  for (const p of candidates) {
    try { return fs.readFileSync(p, 'utf8'); } catch (e) {}
  }
  return null;
}

// "off" toggle: flag file lets /wikispeak stop|normal survive between sessions
const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
let off = false;
try { off = fs.readFileSync(path.join(claudeDir, '.wikispeak-off'), 'utf8').trim() === 'off'; } catch (e) {}

if (off) { process.stdout.write('OK'); process.exit(0); }

const skill = readSkill();
const body = skill
  ? skill.replace(/^---[\s\S]*?---\s*/, '')            // strip YAML frontmatter
  : 'WIKISPEAK: write like a careful human — no puffery, overused vocab, rule-of-three, em-dash filler, or canned closers. Specific over grand, plain over puffed.';

process.stdout.write('WIKISPEAK MODE ACTIVE\n\n' + body);
process.exit(0);
