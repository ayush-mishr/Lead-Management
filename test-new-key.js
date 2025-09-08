// Test the new API key
const API_KEY = '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';

async function testNewAPIKey() {
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('Success! New API key is working');
    return true;
    
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
}

testNewAPIKey().then(result => {
  console.log('New API key test result:', result ? 'PASSED' : 'FAILED');
});
