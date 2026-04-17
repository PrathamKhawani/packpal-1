// api/generate-itinerary.js
// Vercel Serverless Function - runs securely on the server
// The GEMINI_API_KEY is stored as a Vercel Environment Variable (never exposed to users)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination, days, budget, vibe } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: 'Missing required fields: destination and days' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'AI service not configured. Please add GEMINI_API_KEY to Vercel environment variables.' });
  }

  const prompt = `
You are a professional travel planner. Generate a detailed ${days}-day travel itinerary for ${destination}.
STRICT Budget Limit: ₹${budget} Indian Rupees (total for the whole trip, excluding flights). 
You MUST stay under this budget.
Trip vibe: ${vibe || 'balanced'}.

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "destination": "${destination}",
  "totalEstimatedCost": "₹...", 
  "days": [
    {
      "day": 1,
      "label": "Day 1 - Arrival & Explore",
      "events": [
        {
          "time": "9:00 AM",
          "title": "Breakfast at local cafe",
          "description": "Start your day with authentic local cuisine",
          "type": "food",
          "estimatedCost": "₹..."
        }
      ]
    }
  ]
}

Event types MUST be one of: "food", "sightseeing", "transport", "activity", "accommodation", "shopping".
Include 4-6 events per day. All currency must be in Indian Rupees using the symbol ₹.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Gemini API error:', err);
      return res.status(502).json({ error: 'AI service returned an error. Check your API key.' });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ error: 'AI returned empty response.' });
    }

    // Strip any markdown code fences if Gemini wraps it
    const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const itinerary = JSON.parse(cleanJson);

    return res.status(200).json(itinerary);

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Failed to generate itinerary. Please try again.' });
  }
}
