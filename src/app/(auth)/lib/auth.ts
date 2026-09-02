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

// Curated Movie Posters Pool for Random Email Showcase
const MOVIE_POSTER_POOL = [
  { title: 'Spider-Man: Across Spider-Verse', url: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=400&auto=format&fit=crop' },
  { title: 'Batman: The Dark Knight', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop' },
  { title: 'Interstellar Cinema', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop' },
  { title: 'Cyberpunk Metropolis', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop' },
  { title: 'Action Showcase', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop' },
  { title: 'Fantasy Odyssey', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' },
  { title: 'Thriller Midnight', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop' },
  { title: 'Mystery Realm', url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=400&auto=format&fit=crop' },
];

function getRandomMoviePosters(count = 3) {
  const shuffled = [...MOVIE_POSTER_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  trustedOrigins: [
    'http://localhost:3000',
    'https://flixora-client.vercel.app',
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  plugins: [
    emailOTP({
      changeEmail: {
        enabled: true,
      },
      async sendVerificationOTP({ email, otp, type }) {
        try {
          console.log(`[Better Auth OTP] Sending OTP code ${otp} to ${email} (type: ${type})`);

          // Randomize 3 movie posters for this email
          const randomPosters = getRandomMoviePosters(3);

          const isPasswordReset = type === 'forget-password';
          const contextTitle = isPasswordReset ? 'Password Reset Code' : 'Email Verification Code';
          const contextDesc = isPasswordReset
            ? 'Use the 6-digit verification code below to authorize your password reset on Flixora:'
            : 'Use the 6-digit verification code below to confirm your email address change on Flixora:';

          const postersHtml = randomPosters
            .map(
              (p) => `
                <td width="33%" style="padding: 0 4px;">
                  <div style="border-radius: 8px; overflow: hidden; background-color: #1a1a1a; border: 1px solid #262626;">
                    <img src="${p.url}" alt="${p.title}" style="width: 100%; height: 140px; object-fit: cover; display: block;" />
                  </div>
                </td>
              `
            )
            .join('');

          const info = await transporter.sendMail({
            from: `"Flixora Security" <${process.env.EMAIL_SERVER_USER}>`,
            to: email,
            subject: `${otp} is your Flixora ${contextTitle}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Flixora Verification Code</title>
              </head>
              <body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 30px 10px;">
                  <tr>
                    <td align="center">
                      <!-- Main Email Card -->
                      <table width="100%" max-width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #0e0e0e; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                        
                        <!-- Header Branding -->
                        <tr>
                          <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #18181b; background-color: #0a0a0a;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td>
                                  <div style="font-size: 24px; font-weight: 900; color: #FF4C00; letter-spacing: 2px; text-transform: uppercase;">
                                    FLIXORA
                                  </div>
                                  <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px;">
                                    Security & Account Verification
                                  </div>
                                </td>
                                <td align="right">
                                  <span style="display: inline-block; padding: 4px 10px; background-color: #FF4C001A; border: 1px solid #FF4C0040; border-radius: 6px; color: #FF4C00; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                                    Confidential
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                          <td style="padding: 32px;">
                            <h2 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
                              ${contextTitle}
                            </h2>
                            <p style="margin: 0 0 24px 0; font-size: 13px; color: #a1a1aa; line-height: 1.6;">
                              ${contextDesc}
                            </p>

                            <!-- Prominent 6-Digit OTP Box with Easy Copy Icon -->
                            <div style="background-color: #141414; border: 1px solid #27272a; border-left: 4px solid #FF4C00; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; text-align: center;">
                              <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                                Your 6-Digit Verification Code
                              </div>
                              <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; color: #FF4C00; letter-spacing: 10px; margin: 4px 0; text-shadow: 0 0 15px rgba(255, 76, 0, 0.3);">
                                ${otp}
                              </div>
                              <div style="font-size: 11px; color: #a1a1aa; font-weight: 600; margin-top: 10px;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 5px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Select or tap code to copy easily
                              </div>
                            </div>

                            <!-- Expiration & Security Notice Icon -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                              <tr>
                                <td style="font-size: 12px; color: #71717a; line-height: 1.5;">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF4C00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 5px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><strong>Expires in 10 minutes.</strong> Never share this code with anyone.<br/>
                                  If you did not request this verification code, please ignore this email or update your account password.
                                </td>
                              </tr>
                            </table>

                            <!-- Random Trending Movie Posters Grid -->
                            <div style="border-top: 1px solid #18181b; pt-5; padding-top: 24px;">
                              <div style="font-size: 10px; font-weight: 800; color: #FF4C00; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF4C00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 5px;"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>Trending on Flixora This Week
                              </div>
                              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  ${postersHtml}
                                </tr>
                              </table>
                            </div>

                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="padding: 20px 32px; background-color: #080808; border-top: 1px solid #18181b; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #52525b; line-height: 1.5;">
                              &copy; ${new Date().getFullYear()} Flixora Entertainment. All rights reserved.<br/>
                              Automated security message — please do not reply to this email.
                            </p>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
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