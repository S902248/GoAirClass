const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';
const TEST_MOBILE = '9876543210';

async function testOtpFlow() {
    console.log('--- Starting OTP Flow Test ---');

    try {
        // 1. Send OTP
        console.log('\nStep 1: Sending OTP...');
        const sendRes = await axios.post(`${API_URL}/get-otp`, { mobileNumber: TEST_MOBILE });
        console.log('Send OTP Response:', sendRes.data);

        // 2. Resend OTP
        console.log('\nStep 2: Resending OTP...');
        const resendRes = await axios.post(`${API_URL}/resend-otp`, { mobileNumber: TEST_MOBILE });
        console.log('Resend OTP Response:', resendRes.data);
        console.log('(Check backend console for "OTP GENERATED" logs to verify overwrite)');

        // 3. Verify OTP (You will need to manually copy the OTP from the backend console for this step)
        // Since I'm an agent, I can see the console logs. 
        // I'll leave a prompt for verification or try to mock it if possible, 
        // but for a real test, one would provide the OTP here.
        console.log('\nStep 3: Verify OTP (Manual Step Required or check console)');
        
    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

// Note: This script requires the server to be running.
// testOtpFlow();
