"use client"

import Image from 'next/image'
import { useCallback } from 'react'

import { useDescope, useSession, useUser } from '@descope/react-sdk'
import { Descope } from '@descope/react-sdk'
import { getSessionToken } from '@descope/react-sdk';


export default function App() {
  const { isAuthenticated, isSessionLoading } = useSession()
  const { user, isUserLoading } = useUser()
  const { logout } = useDescope()

  const exampleFetchCall = async () => {
    const sessionToken = getSessionToken();

    // example fetch call with authentication header
    fetch('your_application_server_url', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + sessionToken,
      }
    })
  }

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])
  return (
    <>
        <main className="flex min-h-screen flex-col items-center justify-between lg:p-24 md:p-12 p-4">
          {!isAuthenticated &&
            (
              <Descope
                flowId="sign-up-or-in"
                onSuccess={(e) => console.log(e.detail.user)}
                onError={(e) => console.log('Could not log in!')}
              />
            )
          }

          {
            (isSessionLoading || isUserLoading) && <p>Loading...</p>
          }

          {!isUserLoading && isAuthenticated &&
            (
              <>
                <p>Hello {user.name}</p>
                <div>My Private Component</div>
                <button onClick={handleLogout}>Logout</button>
              </>
            )
          }
        </main>
    </>
  )
}
