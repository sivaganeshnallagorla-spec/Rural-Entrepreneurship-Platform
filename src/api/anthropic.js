export const fetchAIPricePrediction = async ({ crop, season, region }) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are an agricultural market expert for India. Predict the current market price per quintal for ${crop} in ${region || 'India'} during ${season || 'current season'}. Reply with ONLY a JSON object like: {"price": 2500, "confidence": "high", "trend": "up", "reasoning": "brief reason"}`
      }]
    })
  });
  const data = await response.json();
  const text = data.content?.[0]?.text || '{"price": 0}';
  try { return JSON.parse(text); } catch { return { price: 0 }; }
};
