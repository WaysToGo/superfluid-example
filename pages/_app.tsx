import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';
import { hasEthereum } from '../utils/ethereum';
export const TokenContext = createContext({
  connectedWalletAddress: "",
  network: '',
  setConnectedWalletAddress: () => { }
});
function MyApp({ Component, pageProps }: AppProps) {

  const [connectedWalletAddress, setConnectedWalletAddressState] = useState("");
  const [network, setNetwork] = useState('')
  useEffect(() => {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(``);
      return;
    }

    setConnectedWalletAddress();
  }, []);
  // requestAccount()
  async function setConnectedWalletAddress() {

    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    try {

      const signerAddress = await signer.getAddress();
      const network = await signer.provider.getNetwork();
      setNetwork(network.name)
      setConnectedWalletAddressState(`${signerAddress}`);
    } catch {
      return;
    }
  }


  return <TokenContext.Provider value={{
    connectedWalletAddress: connectedWalletAddress,
    setConnectedWalletAddress: setConnectedWalletAddress,
    network: network
  }}> <Component {...pageProps} /></TokenContext.Provider>
}

export default MyApp
