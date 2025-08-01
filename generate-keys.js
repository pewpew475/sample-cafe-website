#!/usr/bin/env node

/**
 * Generate Secure Keys for Sample Cafe Website
 * 
 * This script generates secure random keys for JWT and encryption
 * Run with: node generate-keys.js
 */

const crypto = require('crypto');

function generateSecureKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function generateJWTSecret() {
  return crypto.randomBytes(64).toString('base64');
}

console.log('🔐 SAMPLE CAFE - SECURE KEY GENERATOR');
console.log('=====================================\n');

console.log('Copy these values to your .env.local file:\n');

console.log('# Security Settings');
console.log(`JWT_SECRET=${generateJWTSecret()}`);
console.log(`ENCRYPTION_KEY=${generateSecureKey(32)}`);

console.log('\n# Additional Security Keys (if needed)');
console.log(`SESSION_SECRET=${generateSecureKey(32)}`);
console.log(`API_SECRET=${generateSecureKey(24)}`);

console.log('\n📝 INSTRUCTIONS:');
console.log('1. Copy the JWT_SECRET and ENCRYPTION_KEY values above');
console.log('2. Replace the placeholder values in your .env.local file');
console.log('3. Keep these keys secure and never commit them to version control');
console.log('4. Generate new keys for production deployment');

console.log('\n🔒 SECURITY NOTES:');
console.log('- JWT_SECRET: Used for signing JSON Web Tokens');
console.log('- ENCRYPTION_KEY: Used for encrypting sensitive data');
console.log('- These keys are cryptographically secure random values');
console.log('- Each key is unique and should not be shared');

console.log('\n✅ Done! Your secure keys have been generated.');
