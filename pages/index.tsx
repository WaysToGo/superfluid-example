import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext } from 'react';
import { TokenContext } from './_app';
import RootLayout from '../layout/RootLayout';
interface Props {

}
const Home = (props: Props) => {

  const tokenContext = useContext(TokenContext);
  return (
    <RootLayout>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>CoinShift </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>


        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <div className="h-4">
            {/* {connectedWalletAddress && (
            <p className="text-md">{connectedWalletAddress}</p>
          )} */}

          </div>
          <div className='grid gap-x-8 grid-cols-3'>
            {tokenContext.connectedWalletAddress && <div className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
              <div className="pt-1 text-center space-y-4">
                <div className="text-sky-500 dark:text-sky-400">
                  Connected Account
                </div>
                <div className="text-slate-700 dark:text-slate-500 truncate">
                  {tokenContext.connectedWalletAddress}
                </div>
              </div>
            </div>}
            <div className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
              <div className="pt-1 text-center space-y-4">
                <div className="text-sky-500 dark:text-sky-400">
                  Dai Balance
                </div>
                <div className="text-slate-700 dark:text-slate-500 truncate">
                  {tokenContext.connectedWalletAddress}
                </div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
              <div className="pt-1 text-center space-y-4">
                <div className="text-sky-500 dark:text-sky-400">
                  DaiX Balance
                </div>
                <div className="text-slate-700 dark:text-slate-500 truncate">
                  {tokenContext.connectedWalletAddress}
                </div>
              </div>
            </div>
          </div>

        </main>

      </div>
    </RootLayout>
  )
}

export default Home
