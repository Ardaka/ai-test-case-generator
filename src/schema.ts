import { z } from 'zod';

export const testCaseSchema = z.object({
  id: z.string().regex(/^TC-\d{3}$/),
  title: z.string().min(5),
  priority: z.enum(['P0', 'P1', 'P2']),
  type: z.enum(['positive', 'negative', 'boundary', 'accessibility']),
  preconditions: z.array(z.string()),
  steps: z.array(z.string()).min(1),
  expectedResult: z.string().min(5)
});

export const testPlanSchema = z.object({
  feature: z.string().min(2),
  assumptions: z.array(z.string()),
  testCases: z.array(testCaseSchema).min(1),
  risks: z.array(z.string()).min(1)
});

export type TestPlan = z.infer<typeof testPlanSchema>;

