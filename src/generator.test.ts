import { describe, expect, it } from 'vitest';
import { generateDemoPlan } from './demo-generator.js';
import { renderMarkdown } from './render.js';
import { testPlanSchema } from './schema.js';

const story = `# Guest checkout

As a shopper, I want to buy without creating an account.

- The user can enter an email and delivery address.
- Payment errors keep the entered address.
`;

describe('demo generator', () => {
  it('creates a schema-valid, prioritized test plan', () => {
    const plan = testPlanSchema.parse(generateDemoPlan(story));
    expect(plan.feature).toBe('Guest checkout');
    expect(plan.testCases).toHaveLength(5);
    expect(plan.testCases.some((testCase) => testCase.type === 'negative')).toBe(true);
    expect(plan.testCases[0].priority).toBe('P0');
  });

  it('renders review guidance and executable steps', () => {
    const markdown = renderMarkdown(generateDemoPlan(story));
    expect(markdown).toContain('Generated draft');
    expect(markdown).toContain('## TC-001');
    expect(markdown).toContain('**Expected result:**');
  });
});

