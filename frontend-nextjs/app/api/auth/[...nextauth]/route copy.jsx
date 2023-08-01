import NextAuth from "next-auth/next";
import prisma from '../../../libs/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { AxiosError } from "axios";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text", placeholder: "John Smith" },
            },
            async authorize(credentials) {
                // check to see if email and password is there
                if (!credentials.email || !credentials.password) {
                    throw new Error('Please enter an email and password')
                }

                var token = null;
                var user = null;

                // Get access token from API
                const API_URI = "http://localhost:8000";
                const res = await axios.post(`${API_URI}/api/auth/token`, {
                    email: credentials?.email,
                    password: credentials?.password,
                }).then((res) => {
                    // Get user data from API
                    token = res.data.data.token.access_token
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                    return axios.get(`${API_URI}/api/users/me`, config)
                }).catch((err) => {
                    if (err.code === 'ECONNREFUSED') throw new Error('Could not authenticate. Service is offline')
                    else throw new Error('An unexpected error occurred')
                })

                user = await res.data.data
                const userData = {
                    token,
                    user
                }

                // If no error and we have user data, return it
                if (user) {
                    return userData
                }
                return null;
            },
        }),
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {

            console.log("\n\n\n--------------------")
            console.log(token.token)
            console.log(token.user)
            console.log(token.iat)
            console.log(token.exp)
            console.log(token.jti)
            console.log("--------------------\n\n\n")

            // Update next auth token expiration to match API token expiration
            if (token?.token?.access_token) {
                console.log("------------------------------------------------")
                console.log("Updating token")
                token.accessToken = token.token.access_token
                token.accessTokenExpires = new Date(token.token.expires_at).getTime()
                token.refreshToken = token.token.refresh_token
                token.refreshTokenExpires = new Date(token.token.refresh_expires_at).getTime()
                token.idToken = token.token.id_token
                token.idTokenExpires = new Date(token.token.id_expires_at).getTime()
                console.log("------------------------------------------------")
            }




            return { ...token, ...user };
        },
        async session({ session, token }) {
            session = token;
            return session;
        },
    },

    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }