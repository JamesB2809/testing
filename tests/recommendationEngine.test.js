const test = require('node:test');
const assert = require('node:assert/strict');
const { rankRecommendations } = require('../src/recommendationEngine');

test('rankRecommendations sorts by weighted score descending', () => {
  const ranked = rankRecommendations([
    { id: 'a', impact: 0.9, confidence: 0.5, recency: 0.3 },
    { id: 'b', impact: 0.6, confidence: 0.9, recency: 0.9 },
    { id: 'c', impact: 0.8, confidence: 0.8, recency: 0.8 }
  ]);

  assert.deepEqual(
    ranked.map((item) => item.id),
    ['c', 'b', 'a']
  );
});

test('rankRecommendations keeps original input immutable', () => {
  const input = [{ id: 'x', impact: 1, confidence: 1, recency: 1 }];
  const copy = [...input];
  rankRecommendations(input);
  assert.deepEqual(input, copy);
});
