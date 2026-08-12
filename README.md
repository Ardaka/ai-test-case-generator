# AI Test Case Generator

[![Generator quality checks](https://github.com/Ardaka/ai-test-case-generator/actions/workflows/quality.yml/badge.svg)](https://github.com/Ardaka/ai-test-case-generator/actions/workflows/quality.yml)

A TypeScript CLI that turns a user story into a structured, review-ready test plan using GitHub Models.

![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)
![GitHub Models](https://img.shields.io/badge/AI-GitHub_Models-6D5EF6?logo=github)
![Structured output](https://img.shields.io/badge/output-validated_JSON-16A085)

## Why this project

Generic “write test cases” prompts often create duplicates, invent requirements, and return inconsistent formats. This tool adds a repeatable prompt, schema validation, explicit assumptions, priorities, risks, and a human-review reminder.

## Quick demo (no token)

```bash
npm install
npm run generate:demo
```

Open [the generated example](examples/generated-test-plan.md).

## Live AI mode

```bash
GITHUB_TOKEN=your_models_read_token \
npx tsx src/cli.ts --input examples/checkout-story.md --output test-plan.md
```

JSON output is also supported:

```bash
npx tsx src/cli.ts --input story.md --output test-plan.json --format json --demo
```

## How it works

```text
User story → versioned prompt → GitHub Models → Zod validation → Markdown / JSON
                  ↘ --demo → deterministic example generator ↗
```

- `GITHUB_TOKEN` is read from the environment and never stored.
- Model output must pass the same schema used by the tests.
- Unknown business rules become assumptions instead of invented facts.
- Output stays a draft until a QA engineer reviews it.

## Output model

Each test includes:

- ID and short title
- P0/P1/P2 priority
- positive, negative, boundary, or accessibility type
- preconditions and steps
- observable expected result

## Interview demo (2 minutes)

1. Show the checkout user story.
2. Run demo generation and open the Markdown plan.
3. Point out schema validation and the versioned prompt.
4. Explain the guardrails: no invented behavior, explicit assumptions, mandatory human review.

## Project structure

```text
src/github-models.ts       live model integration
src/schema.ts              output guardrail
src/demo-generator.ts      token-free demo mode
src/render.ts              Markdown renderer
prompts/                   versioned prompt asset
examples/                  sample input and result
```

## License

MIT

