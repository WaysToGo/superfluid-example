/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { TokenContext } from '../pages/_app';



function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}
interface Props {
    // connectedWalletAddress: string,
    // setConnectedWalletAddress: () => void;
}
export default function Header(props: Props) {
    const tokenContext = useContext(TokenContext);
    const connectWallet = async () => {
        if (!tokenContext.connectedWalletAddress) {
            await requestAccount();
            tokenContext.setConnectedWalletAddress()
        }
    }
    // Request access to MetaMask account
    async function requestAccount() {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
    }
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex-shrink-0 flex items-center text-white font-mono text-lg">
                                    CoinShift
                                </div>

                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <div
                                    className="text-green-400 "
                                >
                                    {tokenContext.network}
                                </div>

                                <button
                                    type="button"
                                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                    onClick={connectWallet}
                                >
                                    <span className={tokenContext.connectedWalletAddress ? 'text-green-400' : 'text-gray-400'}>{tokenContext.connectedWalletAddress ? 'connected' : 'Connect wallet'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </>
            )}
        </Disclosure>
    )
}
