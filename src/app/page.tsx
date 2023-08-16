"use client"

import './globals.css'
import Image from 'next/image'
import { Textarea } from "@nextui-org/react";
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession()
  const [image, setImage] = useState<Blob>();
  const [prompt, setPrompt] = useState("");

  const promptSubmit = (e: any) => {
    // Create the JSON payload with the 'prompt' property
    const data = {
      prompt: prompt
    };

    // Make a POST request using the fetch function
    fetch("https://2bc8-76-244-43-219.ngrok-free.app/api/python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.blob())
      .then(blob => setImage(blob))
      .catch(error => {
        // Handle any errors that occur during the request
        console.error("Error:", error);
      });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24 md:p-12 p-4">
      {!image && (
        <div className="w-1/5 mb-5">
          <img src="/buildyou.png" alt="buildyou logo">
          </img>
        </div>
      )}
      <div className="border border-slate-700 rounded-lg h-auto lg:w-1/3 w-5/6 p-4">
        {session ? (<>
          <div className="flex flex-row justify-center">
            <p className="text-center align-middle font-semibold h-full mr-3">Signed in as {session.user?.email}</p>
            <button onClick={() => signOut()} className="rounded-lg text-xs	bottom-0 bg-zinc-900 hover:bg-zinc-800 transition px-2 py-1">Sign out</button>
          </div>
          <br />
          <h1 className="text-4xl pt-3 font-bold text-center">Your Profile</h1>
          {!image && (<div className="flex flex-col items-center justify-center">
            <Textarea
              label="Avatar Prompt"
              variant="flat"
              labelPlacement="inside"
              placeholder="Enter your prompt for your avatar here"
              className="w-full m-3 p-3 rounded-lg text-slate-100 transition"
              onValueChange={setPrompt}
            />
            <button onClick={promptSubmit} className="rounded-lg bg-zinc-900 hover:bg-zinc-800 transition p-2">Generate Avatar</button>
          </div>)}
          {image && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center bg-opacity-75"
                style={{ backgroundImage: `url(${URL.createObjectURL(image)})`, filter: "brightness(60%)", }}
              ></div>
              <div className="absolute bottom-0 left-0 p-10 bg-opacity-50 text-white text-sm">
                <div className="mb-1 text-5xl font-bold">{prompt}</div>
                <div>An avatar for {session.user?.email}</div>
              </div>
              <a
                href={URL.createObjectURL(image)}
                download={`image.png`}
                className="text-blue-500 bottom-0 p-10 ml-auto mr-auto underline cursor-pointer"
              >
                Download
              </a>
              <div className="absolute bottom-0 right-0 px-10 py-4 bg-opacity-50 w-1/5 mb-5">
                <img src="/buildyou.png" alt="buildyou logo">
                </img>
              </div>
            </>
          )}
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
