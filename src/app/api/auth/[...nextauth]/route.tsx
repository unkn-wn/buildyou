import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth"
import * as dotenv from 'dotenv';

// Load the environment variables from .env file
dotenv.config();

export const authOptions: NextAuthOptions = {
    providers: [
    {
        id: "descope",
        name: "Descope",
        type: "oauth",
        wellKnown: `https://api.descope.com/P2U2Qj7RfPtUneHiYKkbdGS1h941/.well-known/openid-configuration`,
        authorization: { params: { scope: "openid email profile" } },
        idToken: true,
        clientId: "P2U2Qj7RfPtUneHiYKkbdGS1h941",
        clientSecret: process.env.NEXTAUTH_ACCESS_KEY,
        checks: ["pkce", "state"],
        profile(profile: any) {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
            }
        },
    }]
}  


const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }