import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import nodemailer from 'nodemailer';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.warn("Warning: MONGODB_URI is not set in environment variables.");
}
const client = new MongoClient(mongoUri || 'mongodb://localhost:27017/Flixora');

const db = client.db('Flixora');

// Nodemailer Transporter Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {

      await transporter.sendMail({
        from: `"Flixora Support" <${process.env.EMAIL_SERVER_USER}>`,
        to: user.email,
        subject: 'Reset your password - Flixora',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>You requested to reset your password. Click the link below to set a new password:</p>
            <a href="${url}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #e50914; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    },
  },

  database: mongodbAdapter(db, {
    transaction: false,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
});