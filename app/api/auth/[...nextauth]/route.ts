import NextAuth from "next-auth/next";
import { NextResponse } from "next/server";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@/app/lib/db";
// import { Provider } from "@prisma/client";


const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
      ],
      secret:process.env.NEXTAUTH_SECRET ?? "secret",
      callbacks : {
        async signIn(params) {
          if(!params.user.email) {
            return false;
          }

          console.log(params);
          try {
            await prismaClient.user.create({
              data : {
                email : params.user.email,
                provider: "Google"
              }
            })
          }
          catch(e)
          {

          }
          return true;
        }
      }
})

export {handler as GET,handler as POST}