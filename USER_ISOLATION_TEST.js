// API Test Script - Run this in browser console on your deployed site
// This will help verify if your API endpoints are working

console.log('🧪 Testing API Endpoints...');

// Get the API base URL
const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'https://lead-management-2-wnen.onrender.com/api/v1';
console.log('📍 API Base URL:', API_BASE_URL);

// Test 1: Check if server is running
async function testServerHealth() {
    try {
        const response = await fetch(API_BASE_URL.replace('/api/v1', ''));
        const data = await response.json();
        console.log('✅ Server Health Check:', data);
        return true;
    } catch (error) {
        console.error('❌ Server Health Check Failed:', error);
        return false;
    }
}

// Test 2: Test OTP sending (replace with your email)
async function testOTPSending(email = 'test@example.com') {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/sendotp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                checkUserPresent: false
            })
        });
        const data = await response.json();
        console.log('📧 OTP Test Result:', data);
        return data.success;
    } catch (error) {
        console.error('❌ OTP Test Failed:', error);
        return false;
    }
}

// Test 3: Test CORS
async function testCORS() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/sendotp`, {
            method: 'OPTIONS'
        });
        console.log('🔒 CORS Status:', response.status);
        console.log('🔒 CORS Headers:', response.headers);
        return response.status === 200 || response.status === 204;
    } catch (error) {
        console.error('❌ CORS Test Failed:', error);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🔄 Running all tests...\n');
    
    const healthCheck = await testServerHealth();
    const corsCheck = await testCORS();
    const otpCheck = await testOTPSending();
    
    console.log('\n📊 Test Results Summary:');
    console.log('├── Server Health:', healthCheck ? '✅ PASS' : '❌ FAIL');
    console.log('├── CORS Configuration:', corsCheck ? '✅ PASS' : '❌ FAIL');
    console.log('└── OTP Endpoint:', otpCheck ? '✅ PASS' : '❌ FAIL');
    
    if (healthCheck && corsCheck && otpCheck) {
        console.log('\n🎉 All tests passed! Your API should be working.');
    } else {
        console.log('\n⚠️  Some tests failed. Check the errors above.');
    }
}

// Auto-run tests
runAllTests();

// Export functions for manual testing
window.apiTests = {
    testServerHealth,
    testOTPSending,
    testCORS,
    runAllTests
};
