import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { customSession, organization } from "better-auth/plugins";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    
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
                    organization:true,
                    member:true,
                    client:true,
                }
            });
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