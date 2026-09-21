import { test } from 'node:test';
import assert from 'node:assert/strict';
import { feedbackMessage, validationFeedback } from '../src/lib/feedback.ts';
test('browser and library diagnostics are replaced with actionable feedback', () => {
  assert.match(feedbackMessage(new TypeError('Failed to fetch')), /connection/);
  assert.equal(feedbackMessage(new SyntaxError('Unexpected token <'), 'Please try again.'), 'Please try again.');
  assert.equal(feedbackMessage(new Error('Firebase: auth/internal-error'), 'Please try again.'), 'Please try again.');
  assert.equal(feedbackMessage(new Error('Choose a photo under 25 MB.')), 'Choose a photo under 25 MB.');
});
test('validation feedback describes editable fields rather than schema paths', () => {
  assert.match(validationFeedback([{path:['sections',0,'items',2,'price'],code:'too_small'}]), /price/);
  assert.match(validationFeedback([{path:['password'],code:'too_small'}]), /12 and 128/);
  assert.match(validationFeedback([{path:['endsAt'],code:'custom'}]), /after the event starts/);
  assert.doesNotMatch(validationFeedback([{path:['revision'],code:'invalid_type'}]), /revision|invalid_type/);
});
