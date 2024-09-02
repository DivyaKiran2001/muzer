"use client"

import { signIn, useSession } from "next-auth/react";

export function Appbar(){
    const session = useSession();
    return <div>
        <div className="flex justify-between">
            <div>
            Muzerr
            </div>
            <div>
                {session.data?.user && <button className="m-2 p-2 bg-blue-800 rounded-md" onClick={() => signIn()}>Logout</button> }
                {!session.data?.user && <button className="m-2 p-2 bg-blue-800 rounded-md" onClick={() => signIn()}>SignIn</button> }
            
        </div>
        </div>
        
    </div>
}