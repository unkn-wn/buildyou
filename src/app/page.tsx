"use client"

import './globals.css'
import Image from 'next/image'
import { Textarea } from "@nextui-org/react";
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession()
  const [ prompt, setPrompt ] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:p-24 md:p-12 p-4">
      <div className="border border-slate-700 rounded-lg h-auto lg:w-1/3 w-5/6 p-4">
        {session ? (<>
          <div className="flex flex-row justify-center">
            <p className="text-center align-middle font-semibold h-full mr-3">Signed in as {session.user?.email}</p> 
            <button onClick={() => signOut()} className="rounded-lg text-xs	bottom-0 bg-zinc-900 hover:bg-zinc-800 transition px-2 py-1">Sign out</button>
          </div>
          <br />
          <h1 className="text-4xl pt-3 font-bold text-center">Your Profile</h1>
          <div className="flex flex-col items-center justify-center">
            <Textarea
              label="Avatar Prompt" 
              variant="flat"
              labelPlacement="inside"
              placeholder="Enter your prompt for your avatar here"
              className="w-full m-3 p-3 rounded-lg text-slate-100 transition"
              onValueChange={setPrompt}
            />
            <button className="rounded-lg bg-zinc-900 hover:bg-zinc-800 transition p-2">Generate Avatar</button>
          </div>
        </>) : (
          <div className="grid place-content-center">
            <p className="text-center font-semibold">Not signed in</p> <br />
            <button onClick={() => signIn()} className="w-full rounded-lg bg-zinc-900 hover:bg-zinc-800 transition p-2">Sign in</button>
          </div>
        )}
      </div>
    </main>
  )
}
