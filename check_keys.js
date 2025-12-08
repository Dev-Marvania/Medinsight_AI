import dotenv from 'dotenv';
dotenv.config();

console.log('--- API Key Verification ---');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Present' : '❌ Missing');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✅ Present' : '❌ Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Present' : '❌ Missing');

if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
    console.log('Gemini Configuration: OK');
} else {
    console.log('Gemini Configuration: Missing Code (One of GOOGLE_API_KEY or GEMINI_API_KEY is required)');
}
