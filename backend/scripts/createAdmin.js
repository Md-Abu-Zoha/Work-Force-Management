// Script to create admin user
// Usage: node createAdmin.js <email> <password>

const path = require('path');
const dotenv = require('dotenv');
const { connectToDatabase } = require('../src/config/db');
const AdminUser = require('../src/models/AdminUser');

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error('Usage: node createAdmin.js <email> <password>');
    process.exit(1);
  }

  dotenv.config({ path: path.resolve(__dirname, '../.env') });

  try {
    await connectToDatabase(process.env.MONGODB_URI);
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.log('Admin user already exists for:', email);
      process.exit(0);
    }
    const user = new AdminUser({ email, passwordHash: '' });
    await user.setPassword(password);
    await user.save();
    console.log('Admin user created for:', email);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    process.exit(3);
  }
}

main();