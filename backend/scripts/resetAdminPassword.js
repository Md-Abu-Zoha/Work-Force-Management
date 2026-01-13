// Usage:
//   node backend/scripts/resetAdminPassword.js <email> <newPassword>
//
// This script updates the admin user's password directly using the models,
// loading configuration from backend/.env and reusing the standard DB connector.

const path = require('path');
const dotenv = require('dotenv');
const { connectToDatabase } = require('../src/config/db');
const AdminUser = require('../src/models/AdminUser');

async function main() {
  const [, , email, newPassword] = process.argv;
  if (!email || !newPassword) {
    console.error('Usage: node backend/scripts/resetAdminPassword.js <email> <newPassword>');
    process.exit(1);
  }

  // Always load .env from backend root
  dotenv.config({ path: path.resolve(__dirname, '../.env') });

  try {
    await connectToDatabase(process.env.MONGODB_URI);
    const user = await AdminUser.findOne({ email });
    if (!user) {
      console.error(`No admin user found for email: ${email}`);
      process.exit(2);
    }
    await user.setPassword(newPassword);
    await user.save();
    console.log('Password updated for:', email);
    process.exit(0);
  } catch (err) {
    console.error('Failed to update password:', err.message);
    process.exit(3);
  }
}

main();



