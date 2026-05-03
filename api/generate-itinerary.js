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
Generate a ${days}-day travel itinerary for ${destination}.
Budget: ₹${budget} (MUST stay under). Vibe: ${vibe || 'balanced'}.

Return ONLY minified JSON matching exactly this schema:
{
  "destination": "${destination}",
  "totalEstimatedCost": "₹...",
  "summary": "One sentence about the trip vibe.",
  "lodgingSuggestions": [
    { "name": "Hotel Name", "type": "Luxury/Boutique/Budget", "priceRange": "₹...", "why": "Short reason" }
  ],
  "mustTryFoods": [
    { "dish": "Dish Name", "description": "Short description" }
  ],
  "days": [
    {
      "day": 1,
      "theme": "Day Theme",
      "activities": [
        { "time": "9:00 AM", "activity": "Title", "description": "Short desc", "type": "food/sightseeing/activity", "cost": 0, "lat": 0, "lng": 0 }
      ],
      "diningHighlights": [
        { "name": "Restaurant", "cuisine": "Local/Cuisine", "specialty": "Dish" }
      ]
    }
  ]
}

Rules:
- 3 events per day maximum.
- type must be one of: food, sightseeing, transport, activity, accommodation, shopping.
- All costs in ₹.
- CRITICAL: every event MUST have accurate lat and lng decimal coordinates for its exact specific location (restaurant, landmark, hotel address). Use real-world GPS coordinates.
- Do not output markdown, code fences, or any text outside the JSON object.
`;


  try {
    // 1. Explicitly hardcode stable models to avoid API 'not found' or 'deprecated' errors.
    const selectedModel = 'models/gemini-1.5-flash';

    // 2. Execute text generation with the dynamically discovered model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Gemini API error details:', JSON.stringify(err, null, 2));
      
      let errorMessage = 'AI service returned an error. Check your API key.';
      if (err.error) {
        if (err.error.status === 'UNAUTHENTICATED') {
          errorMessage = 'Invalid API Key. Please verify your GEMINI_API_KEY in Vercel settings.';
        } else if (err.error.status === 'RESOURCE_EXHAUSTED') {
          errorMessage = 'Daily AI quota exceeded. Try again tomorrow or use a different key.';
        } else if (err.error.message) {
          errorMessage = `AI Error: ${err.error.message}`;
        }
      }
      
      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ error: 'AI returned empty response (possibly blocked by safety filters).' });
    }

    // Bulletproof JSON extraction: find the first { and last }
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.error('No JSON found in text:', rawText);
        return res.status(502).json({ error: 'AI did not return a valid itinerary format. Please try again.' });
    }
    
    const cleanJson = jsonMatch[0];

    let itinerary;
    try {
        itinerary = JSON.parse(cleanJson);
    } catch (parseErr) {
        console.error('JSON Parse Error:', parseErr, 'Clean Text:', cleanJson);
        return res.status(502).json({ error: 'AI returned malformed data. Please try again.' });
    }

    return res.status(200).json(itinerary);

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'System Error: ' + err.message });
  }
}

