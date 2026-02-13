function rankRecommendations(items) {
  return [...items]
    .map((item) => ({
      ...item,
      score: Number((item.impact * 0.5 + item.confidence * 0.3 + item.recency * 0.2).toFixed(4))
    }))
    .sort((a, b) => b.score - a.score);
}

module.exports = { rankRecommendations };
