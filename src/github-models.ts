import { testPlanSchema, type TestPlan } from './schema.js';

function cleanJson(content: string) {
  return content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

export async function generateWithGitHubModels(story: string): Promise<TestPlan> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required unless --demo is used');

  const response = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? 'openai/gpt-4.1',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: [
            'You are a pragmatic senior QA engineer.',
            'Return only valid JSON with: feature, assumptions[], testCases[], risks[].',
            'Each test case must have id TC-001 style, title, priority P0/P1/P2,',
            'type positive/negative/boundary/accessibility, preconditions[], steps[], expectedResult.',
            'Create 5-8 non-duplicate cases. Do not invent product behavior; put uncertainty in assumptions.'
          ].join(' ')
        },
        { role: 'user', content: story }
      ]
    })
  });

  if (!response.ok) throw new Error(`GitHub Models returned ${response.status}: ${await response.text()}`);
  const body = await response.json() as any;
  const content = body.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw new Error('The model response did not include text content');
  return testPlanSchema.parse(JSON.parse(cleanJson(content)));
}

