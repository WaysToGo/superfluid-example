// Check for MetaMask wallet browser extension
function hasEthereum() {
    return typeof window !== 'undefined' && typeof (window as any)?.ethereum !== 'undefined'
}

export { hasEthereum }
