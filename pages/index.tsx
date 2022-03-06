import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useState } from 'react';
import { TokenContext } from './_app';
import RootLayout from '../layout/RootLayout';
import { ethers } from 'ethers';
import { Framework } from '@superfluid-finance/sdk-core';
interface Props {

}

//where the Superfluid logic takes place
async function createNewFlow(recipient: string, flowRate: string) {
  const { ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(ethereum);

  const signer = await provider.getSigner();

  const chainId = await ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
  });

  const DAIx = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      receiver: recipient,
      flowRate: flowRate,
      superToken: DAIx
      // userData?: string
    });

    console.log("Creating your stream...");
    const result = await createFlowOperation.exec(signer);
    console.log(result);

    alert(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Super Token: DAIx
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `
    );
  } catch (error) {
    console.log(error)
    alert(
      "your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}
const Home = (props: Props) => {
  const [recipient, setRecipient] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const tokenContext = useContext(TokenContext);
  function calculateFlowRate(amount: number) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = +monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }
  const handleRecipientChange = (e: any) => {
    setRecipient(e.target.value);
  };

  const handleFlowRateChange = (e: any) => {
    setFlowRate(e.target.value);
    let newFlowRateDisplay = calculateFlowRate(e.target.value);
    setFlowRateDisplay(newFlowRateDisplay!.toString());
  };


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
                  {tokenContext.daiBalance}
                </div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
              <div className="pt-1 text-center space-y-4">
                <div className="text-sky-500 dark:text-sky-400">
                  DaiX Balance
                </div>
                <div className="text-slate-700 dark:text-slate-500 truncate">
                  {tokenContext.daixBalance}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-300 rounded-xl p-8 dark:bg-slate-800 mt-5" >
            <div className=" text-center space-y-4">
              <div className="text-sky-500 dark:text-sky-400">
                Approve and Deposit DAI into superfluid to ming DAIx
              </div>
              <div className="text-slate-700 dark:text-slate-500 flex justify-center">
                <input placeholder='Amount' className='m-2'>
                </input>
              </div>
              <div className='grid grid-cols-2 gap-x-5'>
                <button className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-2 md:text-lg md:px-10"
                >
                  Approve
                </button>
                <button className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-10"
                >
                  Deposit
                </button>
              </div>

            </div>
          </div>
          <div className="bg-slate-300 rounded-xl p-8 dark:bg-slate-800 mt-5" >
            <div className=" text-center space-y-4">
              <div className="text-sky-500 dark:text-sky-400">
                Stream DAI
              </div>
              <div className="text-slate-700 dark:text-slate-500 flex">
                <input placeholder='Enter Address to stream' className='m-2' onChange={handleRecipientChange}>
                </input>
                <input placeholder='DAIx/Month' className='m-2' onChange={handleFlowRateChange}>
                </input>
              </div>
              <button className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-10"
                onClick={
                  () => createNewFlow(recipient, flowRate)
                }
              >
                Start Stream
              </button>
            </div>
          </div>
          {flowRateDisplay && <div> Flow Rate {flowRateDisplay}</div>}
        </main>

      </div >
    </RootLayout >
  )
}

export default Home
