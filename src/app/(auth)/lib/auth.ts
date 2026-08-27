import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient("mongodb+srv://anujpaul27:Z6EZ1l69zYKn4EKC@cluster0.y4twyvs.mongodb.net/?appName=Cluster0");
const db = client.db('Flexora');

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url, token }, request) {
      // এখানে ইমেইল পাঠানোর লজিক (e.g. Nodemailer/Resend)
      console.log(`Reset password link: ${url}`);
    },
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});