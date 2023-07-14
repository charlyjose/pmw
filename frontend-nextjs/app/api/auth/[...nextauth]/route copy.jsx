import NextAuth from "next-auth/next";
import prisma from '../../../libs/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'

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

                // check to see if user exists
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                // if no user was found 
                if (!user || !user?.hashedPassword) {
                    throw new Error('User not found')
                }

                // check to see if password matches
                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

                // if password does not match
                if (!passwordMatch) {
                    throw new Error('Incorrect password')
                }

                return user;
            },
        }),
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // async jwt({ token, account }) {
        //     // Persist the OAuth access_token to the token right after signin
        //     if (account) {
        //         token.accessToken = account.access_token
        //         console.log("okokoekooekro::::::: ", account.access_token)
        //     }
        //     return token
        // },
        // async session({ session, token, user }) {
        //     // Send properties to the client, like an access_token from a provider.
        //     session.accessToken = token.accessToken

        //     console.log("TOOOOOKENNS", token.account.accessToken)

        //     return session
        // },
        // Ovveride the SignOut function
        
        // jwt: async (token, user, account, profile, isNewUser) => {
        //     console.log("JWT: ", token)
        //     console.log("USER: ", user)
        //     // console.log("ACCOUNT: ", account)
        //     // console.log("PROFILE: ", profile)
        //     // console.log("IS NEW USER: ", isNewUser)

        //     if (user) {
        //         token.accessToken = user.access_token
        //     }



        //     return { ...token, ...user };
        // },


        // jwt: async (token) => {
        //     console.log("JWT: ", token)
        // },

        










        session: async (session) => {
            if (!session) return;
            console.log("SESSION__BACKEND: ", session)

            const userData = await prisma.user.findUnique({
                where: {
                    email: session.session.user.email,
                }
            });

            session.accessToken = "_access_token_"
            console.log("SESSION__BACKEND______2: ", session)

            return {
                user: {
                    name: userData.name,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                    department: userData.department,
                    email: userData.email,
                    accessToken: session,
                }
            };
        },
    },

    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }