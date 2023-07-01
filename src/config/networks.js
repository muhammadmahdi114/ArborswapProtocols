import { BSC, BSCTestnet } from '@usedapp/core'

export const getNetworkConfig = (defaultChainId) => ({
  readOnlyChainId: defaultChainId,
  readOnlyUrls: {
    [BSC.chainId]: 'https://rpc.ankr.com/bsc',
    [BSCTestnet.chainId]:'https://rpc.ankr.com/bsc_testnet_chapel',
  },
  networks: [BSC, BSCTestnet],
  noMetamaskDeactivate: true,
  refresh: 'never',
  pollingInterval: 15000,
})