#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { generateDemoPlan } from './demo-generator.js';
import { generateWithGitHubModels } from './github-models.js';
import { renderMarkdown } from './render.js';

function valueAfter(flag: string) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv.includes('--help') || process.argv.length === 2) {
  console.log(`Usage:
  npm run generate:demo
  tsx src/cli.ts --input story.md [--output plan.md] [--format markdown|json] [--demo]

Environment for live AI mode:
  GITHUB_TOKEN  token with GitHub Models read access
  AI_MODEL      optional model id (default: openai/gpt-4.1)`);
  process.exit(0);
}

const input = valueAfter('--input');
if (!input) throw new Error('--input is required');
const output = valueAfter('--output');
const format = valueAfter('--format') ?? (output?.endsWith('.json') ? 'json' : 'markdown');
if (!['markdown', 'json'].includes(format)) throw new Error('--format must be markdown or json');

const story = await readFile(resolve(input), 'utf8');
const demo = process.argv.includes('--demo');
const plan = demo ? generateDemoPlan(story) : await generateWithGitHubModels(story);
const rendered = format === 'json' ? `${JSON.stringify(plan, null, 2)}\n` : renderMarkdown(plan);

if (output) {
  await writeFile(resolve(output), rendered, 'utf8');
  console.log(`Created ${output} using ${demo ? 'demo' : 'GitHub Models'} mode.`);
} else {
  console.log(rendered);
}

