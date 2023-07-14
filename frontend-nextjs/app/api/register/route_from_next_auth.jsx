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


                console.log(credentials)

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


                // console.log("SERVER SIDE")
                console.log(user);



                return user;
            },
        }),
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session: async (session) => {
            if (!session) return;

              console.log("SESSION: ", session)

            const userData = await prisma.user.findUnique({
                where: {
                    email: session.session.user.email,
                }
            });

            const userAccount = await prisma.account.findMany()
            console.log("USER ACCOUNT: ", userAccount)


            // const getToken = await prisma.account.findUnique({
            //     where: {
            //       userId: userData.id,
            //     },
            //   });
        
            //   let accessToken: string | null = null;
            //   if (getToken) {
            //     accessToken = getToken.access_token!;
            //     console.log("ACCESS TOKEN: ", accessToken);
            //   }
        
            return {
                user: {
                    name: userData.name,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                    department: userData.department,
                    email: userData.email,
                    access_token: session.session.user.access_token,
                }
            };
        },
    },

    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }