import type { TestPlan } from './schema.js';

function featureName(story: string) {
  const heading = story.match(/^#\s+(.+)$/m)?.[1];
  return heading?.trim() ?? 'Requested feature';
}

function criteria(story: string) {
  const lines = story.split('\n')
    .map((line) => line.replace(/^\s*[-*]\s+/, '').trim())
    .filter((line) => /^(given|when|then|the |a |an |user |order |payment |error )/i.test(line));
  return lines.slice(0, 4);
}

export function generateDemoPlan(story: string): TestPlan {
  const feature = featureName(story);
  const acceptanceCriteria = criteria(story);
  const coreExpectation = acceptanceCriteria[0] ?? 'The main user flow completes successfully';

  return {
    feature,
    assumptions: [
      'The user has access to the feature under test',
      'Test data can be created without affecting production',
      ...(acceptanceCriteria.length ? [`Primary criterion: ${coreExpectation}`] : [])
    ],
    testCases: [
      {
        id: 'TC-001', title: `Complete the ${feature.toLowerCase()} happy path`, priority: 'P0', type: 'positive',
        preconditions: ['A valid user is signed in', 'Required test data exists'],
        steps: ['Open the feature', 'Enter valid data', 'Submit the action'],
        expectedResult: 'The action succeeds and a clear confirmation is shown'
      },
      {
        id: 'TC-002', title: 'Reject missing required information', priority: 'P0', type: 'negative',
        preconditions: ['The feature is available'],
        steps: ['Open the feature', 'Leave required information empty', 'Attempt to submit'],
        expectedResult: 'Submission is blocked and field-level guidance explains how to recover'
      },
      {
        id: 'TC-003', title: 'Handle the largest allowed input value', priority: 'P1', type: 'boundary',
        preconditions: ['The documented upper boundary is known'],
        steps: ['Enter the maximum supported value', 'Submit the action', 'Check persisted data'],
        expectedResult: 'The boundary value is accepted and stored without truncation or calculation errors'
      },
      {
        id: 'TC-004', title: 'Preserve data after a recoverable service error', priority: 'P1', type: 'negative',
        preconditions: ['A service error can be simulated'],
        steps: ['Enter valid data', 'Simulate a temporary service failure', 'Submit and retry'],
        expectedResult: 'The error is explained, entered data remains available, and retry succeeds once'
      },
      {
        id: 'TC-005', title: 'Complete the main flow using only a keyboard', priority: 'P2', type: 'accessibility',
        preconditions: ['A desktop browser is open'],
        steps: ['Navigate with Tab and Shift+Tab', 'Activate controls with the keyboard', 'Submit the flow'],
        expectedResult: 'Focus is visible, order is logical, and every action is keyboard accessible'
      }
    ],
    risks: [
      'Unclear business boundaries may lead to missing edge cases',
      'Retries could create duplicate transactions',
      'Error handling may expose technical details or lose user input'
    ]
  };
}

