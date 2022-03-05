import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';
import { hasEthereum } from '../utils/ethereum';
export const TokenContext = createContext({
  connectedWalletAddress: "",
  network: '',
  setConnectedWalletAddress: () => { },
  daixBalance: '',
  daiBalance: '',
  ethBalance: ''
});
//todo move api to vercel/hosting platform
const apiLink = `https://api-goerli.etherscan.io/api?action=getabi&apikey=IAIUXU71QTU8WNJWQBKTUSBJTVCPREWXU3`
const tokenAddresses = [{
  address: '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00',
  token: 'DAIx'
}, {
  address: '0x88271d333C72e51516B67f5567c728E702b3eeE8',
  token: 'DAI'
}]
function MyApp({ Component, pageProps }: AppProps) {

  const [connectedWalletAddress, setConnectedWalletAddressState] = useState("");
  const [network, setNetwork] = useState('');
  const [daixBalance, setDaixBalance] = useState('');
  const [daiBalance, setDaiBalance] = useState('');
  const [ethBalance, setEthBalance] = useState('');
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
      // console.log(ethers.utils.formatEther(await signer.getGasPrice()), "test")
      // console.log(ethers.utils.formatEther(await signer.estimateGas()), "test")
      provider.getBalance(signerAddress).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance)
        setEthBalance(balanceInEth)
      })

      // const daixContract = new ethers.Contract(tokenAddresses[0].address, daixabi, provider);
      // console.log(daixContract)
      // daixContract.balanceOf(signerAddress).then((balance: string) => {
      //   console.log(balance, "test")
      //   setDaixBalance(balance)
      // })
      // console.log(await provider.listAccounts())
      await getBalances()
    } catch (e) {
      console.log(e)
      return;
    }
  }

  const getBalances = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    try {
      const signerAddress = await signer.getAddress();
      const network = await signer.provider.getNetwork();
      const networkName = network.name;
      provider.getBalance(signerAddress).then((balance) => {
        const balanceInEth = ethers.utils.formatEther(balance)
        setEthBalance(balanceInEth)
      })
      const [daixABI, daiABI] = await Promise.all([
        fetch(`${apiLink}&address=${tokenAddresses[0].address}&module=contract`).then(res => res.json()),
        fetch(`${apiLink}&address=${tokenAddresses[1].address}&module=contract`).then(res => res.json()),
      ])
      console.log(daixABI, daiABI)
      const daixContract = new ethers.Contract(tokenAddresses[0].address, daixABI.result, provider);
      const daiContract = new ethers.Contract(tokenAddresses[1].address, daiABI.result, provider);
      // daixContract.balanceOf(signerAddress).then((balance: string) => {
      //   setDaixBalance(ethers.utils.formatEther(balance))
      // })
      daiContract.balanceOf(signerAddress).then((balance: string) => {
        setDaiBalance(ethers.utils.formatEther(balance))
      })
    } catch (e) { console.log(e) }

  }

  // const daixContract = new ethers.Contract(tokenAddresses[0].address, daixabi, provider);
  // console.log(daixContract)

  // console.log(await provider.listAccounts())


  return <TokenContext.Provider value={{
    connectedWalletAddress: connectedWalletAddress,
    setConnectedWalletAddress: setConnectedWalletAddress,
    network: network,
    daixBalance: daixBalance,
    daiBalance: daiBalance,
    ethBalance: ethBalance
  }}> <Component {...pageProps} /></TokenContext.Provider>
}

export default MyApp
