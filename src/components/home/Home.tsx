import Link from "next/link"
import React from "react"

import { useFirebase, useUserState } from "components/FirebaseContext"

import styles from "./Home.module.scss"

const Home: React.FC = () => {
  const { getFirebase } = useFirebase()
  const { user, initialized } = useUserState()

  const logout = async () => {
    const firebase = await getFirebase()
    await firebase.auth().signOut()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2">
      <header className="fixed top-0 w-full h-12 bg-gray-700">
        <div className="flex items-center justify-end w-full h-full max-w-4xl px-4 mx-auto">
          <div className="grid grid-flow-col gap-x-4">
            <Link href="/communication">
              <a className={styles.button}>Communication</a>
            </Link>
            <Link href="/privacy">
              <a className={styles.button}>Privacy Policy</a>
            </Link>
            <Link href="/gallary">
              <a className={styles.button}>Gallary</a>
            </Link>
            {!initialized ? null : user ? (
              <button className={styles.button} onClick={logout}>
                Logout
              </button>
            ) : (
              <Link href="/login">
                <a className={styles.button}>Login</a>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 py-20">
        <h1 className="m-0 text-6xl leading-tight text-center">
          Welcome to{" "}
          <a
            className="outline-none text-primary hover:underline focus:underline"
            href="https://nextjs.org"
          >
            Next.js!
          </a>
        </h1>

        <p className="text-2xl leading-normal text-center">
          Get started by editing{" "}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded">
            pages/index.js
          </code>
        </p>

        <div className="flex flex-col flex-wrap items-center justify-center w-full max-w-3xl mt-12 md:flex-row">
          <a className={styles.card} href="https://nextjs.org/docs">
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a className={styles.card} href="https://nextjs.org/learn">
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            className={styles.card}
            href="https://github.com/vercel/next.js/tree/master/examples"
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            className={styles.card}
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t border-gray-300">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img className="ml-2 h-font" src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </footer>
    </div>
  )
}

export default Home
