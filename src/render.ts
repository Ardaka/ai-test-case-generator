import type { TestPlan } from './schema.js';

export function renderMarkdown(plan: TestPlan) {
  const cases = plan.testCases.map((testCase) => [
    `## ${testCase.id} — ${testCase.title}`,
    '',
    `**Priority:** ${testCase.priority} · **Type:** ${testCase.type}`,
    '',
    '**Preconditions**',
    ...testCase.preconditions.map((item) => `- ${item}`),
    '',
    '**Steps**',
    ...testCase.steps.map((item, index) => `${index + 1}. ${item}`),
    '',
    `**Expected result:** ${testCase.expectedResult}`
  ].join('\n')).join('\n\n---\n\n');

  return [
    `# Test plan: ${plan.feature}`,
    '',
    '> Generated draft. A QA engineer should review assumptions, business rules, and priorities before execution.',
    '',
    '## Assumptions',
    ...plan.assumptions.map((item) => `- ${item}`),
    '',
    '## Risk focus',
    ...plan.risks.map((item) => `- ${item}`),
    '',
    cases,
    ''
  ].join('\n');
}

