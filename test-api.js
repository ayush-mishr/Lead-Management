// Quick test for the OpenRouter API key
import fetch from 'node-fetch';

const API_KEY = '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';

async function testAPIKey() {
  console.log('Testing API key:', API_KEY.substring(0, 15) + '...');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://localhost:3000',
        'X-Title': 'API Test'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'user', content: 'Hello, test message' }
        ],
        max_tokens: 10
      })
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    if (response.ok) {
      console.log('✅ API Key is VALID and working!');
      return true;
    } else {
      console.log('❌ API Key test FAILED');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error testing API key:', error.message);
    return false;
  }
}

testAPIKey();
