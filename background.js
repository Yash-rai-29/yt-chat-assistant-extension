chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'userQuery') {
    const query = message.query;
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual Gemini API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: { parts: { text: "system prompt goes here..." } },
        contents: [{ parts: [{ text: `User query goes here: ${query}` }] }]
      })
    })
    .then(response => response.json())
    .then(data => {
      const responseData = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini AI.';
      sendResponse({ action: 'geminiAPIResponse', data: responseData });
    })
    .catch(error => {
      console.error('Error fetching from Gemini AI:', error);
      sendResponse({ action: 'geminiAPIResponse', data: 'Error fetching response.' });
    });

    return true; // Keep the message channel open for sendResponse
  }
});
