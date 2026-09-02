import { betterAuth } from 'better-auth';
import { MongoClient, ObjectId } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import nodemailer from 'nodemailer';
import { emailOTP } from 'better-auth/plugins';

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
  plugins: [
    emailOTP({
      changeEmail: {
        enabled: true,
      },
      async sendVerificationOTP({ email, otp, type }) {
        try {
          console.log(`[Better Auth OTP] Sending OTP code ${otp} to ${email} (type: ${type})`);
          const info = await transporter.sendMail({
            from: `"Flixora Support" <${process.env.EMAIL_SERVER_USER}>`,
            to: email,
            subject: 'Your Flixora Email Verification Code',
            html: `
              <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0c0c0c; color: #ffffff; border-radius: 12px;">
                <h2 style="color: #FF4C00; font-size: 20px; text-transform: uppercase; margin-bottom: 8px;">Flixora Verification Code</h2>
                <p style="color: #a1a1aa; font-size: 14px;">Your 6-digit verification code for Flixora is:</p>
                <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #FF4C00; background-color: #141414; padding: 16px 24px; border-radius: 8px; display: inline-block; margin: 16px 0;">${otp}</div>
                <p style="color: #71717a; font-size: 12px;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
              </div>
            `,
          });
          console.log(`[Better Auth OTP] Successfully sent OTP email to ${email}. MessageId: ${info.messageId}`);
        } catch (mailErr) {
          console.error('[Better Auth OTP] Error sending email via Nodemailer:', mailErr);
        }
      },
    }),
  ],

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

  user: {
    additionalFields: {
      planId: {
        type: 'string',
        required: false,
        defaultValue: ''
      },
      plan: {
        type: 'string',
        required: false,
        defaultValue: 'Basic'
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user'
      }
    }
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const basicPlan = await db.collection('plans').findOne({ name: 'Basic' });
            if (basicPlan) {
              await db.collection('user').updateOne(
                { _id: new ObjectId((user as any).id) },
                { 
                  $set: { 
                    planId: basicPlan._id.toString(),
                    plan: 'Basic',
                    role: 'user'
                  } 
                }
              );
            }
          } catch (err) {
            console.error('Error assigning default plan in database hook:', err);
          }
        }
      }
    }
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