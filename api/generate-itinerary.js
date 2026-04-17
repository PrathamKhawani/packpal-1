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
        },
        {
          "time": "11:00 AM",
          "title": "Visit Museum",
          "description": "Explore the local history",
          "type": "sightseeing",
          "estimatedCost": "₹..."
        }
      ]
    }
  ]
}

Event types MUST be one of: "food", "sightseeing", "transport", "activity", "accommodation", "shopping".
Include 3-4 events per day. Keep event descriptions extremely short and punchy (1 sentence max). All currency must be in Indian Rupees using the symbol ₹.
`;

  try {
    // 1. Discover available models dynamically to avoid standard 404 errors
    let selectedModel = 'models/gemini-1.5-flash-latest'; // Fallback
    
    try {
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        if (modelsData && modelsData.models) {
          // Filter for models that support text generation
          const validModels = modelsData.models.filter(m => 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes('generateContent') &&
            m.name.includes('gemini') && 
            !m.name.includes('vision') // Prefer text/multimodal base over pure vision legacy
          );
          
          if (validModels.length > 0) {
            // Prioritize newest flash -> any flash -> pro
            const flash15 = validModels.find(m => m.name.includes('1.5-flash'));
            const anyFlash = validModels.find(m => m.name.includes('flash'));
            const pro15 = validModels.find(m => m.name.includes('pro'));
            
            const bestModel = flash15 || anyFlash || pro15 || validModels[0];
            selectedModel = bestModel.name; 
          }
        }
      }
    } catch (e) {
      console.warn("Model discovery failed, using fallback.", e);
    }

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
            maxOutputTokens: 4096
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
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ error: 'AI returned empty response (possibly blocked by safety filters).' });
    }

    // Extra text stripping: find the exact JSON object bracket bounds
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
        return res.status(502).json({ error: 'AI output format was invalid. Please try again.\\n\\nRAW DUMP: ' + rawText });
    }
    
    let itinerary;
    try {
        // Auto-repair missing trailing commas between objects (a common LLM JSON bug)
        let repairedJson = match[0].replace(/\}\s*(?=\{)/g, '},');
        itinerary = JSON.parse(repairedJson);
    } catch (parseErr) {
        console.error('JSON Parse Error:', parseErr, 'Raw Text:', rawText);
        return res.status(502).json({ error: 'AI returned malformed data. Details: ' + parseErr.message + '\\n\\nRAW DUMP: ' + rawText });
    }

    return res.status(200).json(itinerary);

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'System Error: ' + err.message });
  }
}

