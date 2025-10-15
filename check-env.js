console.log('🔍 Checking Environment Variables');
console.log('='.repeat(30));

console.log('JWT_SECRET:', process.env.JWT_SECRET || 'NOT FOUND');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET || 'NOT FOUND');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT FOUND');

console.log('\n📡 Testing API with current env...');

const jwt = require('jsonwebtoken');

if (process.env.JWT_SECRET) {
  try {
    const token = jwt.sign(
      { email: 'admin@nusantaratour.com', role: 'admin' },
      process.env.JWT_SECRET
    );
    console.log('✅ JWT Token generated successfully');
    console.log('Token length:', token.length);
  } catch (error) {
    console.error('❌ JWT Error:', error.message);
  }
} else {
  console.log('❌ Cannot test JWT - no secret found');
}