import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { customSession, organization } from "better-auth/plugins";
 
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
                    member:true,
                    client:true,
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
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
});