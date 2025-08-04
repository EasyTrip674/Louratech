import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { customSession, organization } from "better-auth/plugins";
import { scrypt } from "scrypt"; 
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL:process.env.BETTER_AUTH_URL,
    plugins: [
        organization(
            {
                allowUserToCreateOrganization: async (user) => {
                    // check if user is an admin
                    console.log("User:", user);
                    return true;
                }
            }
        ),

        customSession(async ({ user, session }) => {
            const allUser = await prisma.user.findUnique({
                where:{
                    id: user.id
                },
                include:{
                  admin:true,
                    organization:{
                       include:{
                        comptaSettings:true,
                       }
                    },
                    authorize:true,
                }
            });
            if (!allUser) {
                throw new Error("User not found");
            }
            return {
                userDetails: allUser,
                user: {
                    ...user,
                    newField: "newField",
                },
                session
            };
        }),
    ],
    emailAndPassword:{
        enabled: true,
        autoSignIn: false,
        password: {
              hash: async (password: string) => {
                // Your custom password hashing logic here, e.g., using scrypt
                const hashedPassword = await scrypt.hash(password, { N: 16384, r: 8, p: 1 });
                return hashedPassword;
              },
              verify: async (password: string, hashedPassword: string) => {
                // Your custom password verification logic here
                const isValid = await scrypt.verify(password, hashedPassword);
                return isValid;
              },
        },
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
});