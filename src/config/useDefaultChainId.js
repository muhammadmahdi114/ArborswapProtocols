import { useState, useEffect } from 'react'
import { BSC, BSCTestnet } from '@usedapp/core'

export function useDefaultChainId() {
  const [defaultChainId, setDefaultChainId] = useState(() => {
    const storedChainId = localStorage.getItem('network-switch')
    if (storedChainId) {
      const items = JSON.parse(storedChainId)
      const activeItem = items.find((item) => item.isActive)

      if (activeItem.title === 'BSC Testnet') {
        return BSCTestnet.chainId
      } else if (activeItem.title === 'Binance Smart Chain') {
        return BSC.chainId
      }
    }

    // If no stored value, return the preferred default chainId
    const isPreferredBsc = true
    return isPreferredBsc ? BSC.chainId : BSCTestnet.chainId
  })

  useEffect(() => {
    const handleStorageChange = (e) => {
      const network = localStorage.getItem('network-switch')
      if (network) {
        const items = JSON.parse(network)
        const activeItem = items.find((item) => item.isActive)
      
        if (activeItem.title === 'BSC Testnet') {
          setDefaultChainId(BSCTestnet.chainId)
        } else if (activeItem.title === 'Binance Smart Chain') {
          setDefaultChainId(BSC.chainId)
        }
      }

      //window.location.reload()
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return defaultChainId
}
