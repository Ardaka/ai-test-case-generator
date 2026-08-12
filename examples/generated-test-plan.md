# Test plan: Guest checkout

> Generated draft. A QA engineer should review assumptions, business rules, and priorities before execution.

## Assumptions
- The user has access to the feature under test
- Test data can be created without affecting production
- Primary criterion: The shopper enters an email and delivery address.

## Risk focus
- Unclear business boundaries may lead to missing edge cases
- Retries could create duplicate transactions
- Error handling may expose technical details or lose user input

## TC-001 — Complete the guest checkout happy path

**Priority:** P0 · **Type:** positive

**Preconditions**
- A valid user is signed in
- Required test data exists

**Steps**
1. Open the feature
2. Enter valid data
3. Submit the action

**Expected result:** The action succeeds and a clear confirmation is shown

---

## TC-002 — Reject missing required information

**Priority:** P0 · **Type:** negative

**Preconditions**
- The feature is available

**Steps**
1. Open the feature
2. Leave required information empty
3. Attempt to submit

**Expected result:** Submission is blocked and field-level guidance explains how to recover

---

## TC-003 — Handle the largest allowed input value

**Priority:** P1 · **Type:** boundary

**Preconditions**
- The documented upper boundary is known

**Steps**
1. Enter the maximum supported value
2. Submit the action
3. Check persisted data

**Expected result:** The boundary value is accepted and stored without truncation or calculation errors

---

## TC-004 — Preserve data after a recoverable service error

**Priority:** P1 · **Type:** negative

**Preconditions**
- A service error can be simulated

**Steps**
1. Enter valid data
2. Simulate a temporary service failure
3. Submit and retry

**Expected result:** The error is explained, entered data remains available, and retry succeeds once

---

## TC-005 — Complete the main flow using only a keyboard

**Priority:** P2 · **Type:** accessibility

**Preconditions**
- A desktop browser is open

**Steps**
1. Navigate with Tab and Shift+Tab
2. Activate controls with the keyboard
3. Submit the flow

**Expected result:** Focus is visible, order is logical, and every action is keyboard accessible
