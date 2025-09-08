// Test file to validate OpenRouter API key
const API_KEY = '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';

async function testAPIKey() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'API Key Test'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'user', content: 'Hello, this is a test' }
        ],
        max_tokens: 50
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('Success! API key is working:', data);
    return true;
    
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
}

// Run the test
testAPIKey().then(result => {
  console.log('API key test result:', result ? 'PASSED' : 'FAILED');
});
