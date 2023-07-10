import { BSC, BSCTestnet } from '@usedapp/core'
import { RbaChain } from './chain'

export const MULTICALL_ADDRESS = {
  [BSC.chainId]: BSC.multicallAddress,
  [BSCTestnet.chainId]: BSCTestnet.multicallAddress,
  [RbaChain.chainId]: RbaChain.multicallAddress,
}

export const RPC_ADDRESS = {
  [BSCTestnet.chainId]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  159: 'https://preseed-testnet-1.roburna.com/',
  [BSC.chainId]: 'https://rpc.ankr.com/bsc',
}


export const ADMIN_ADDRESS = {
  [BSC.chainId]: BSC.multicallAddress,
  [BSCTestnet.chainId]: '0x1bf08cf44A856fe437Bedc89BA53bF43FE5Ca15D',
  [RbaChain.chainId]: '0x00687AD41983f022929E9e5C9a2cd58A291F661f',
}

export const FACTORY_ADDRESS = {
  [BSC.chainId]: '0x35beffc0713034a91bB0aA45B9BC15C0a7AE24cA',
  [BSCTestnet.chainId]: '0x4e6EaABE9F57C6c757a6Fc3F1e97Cb2d0f05C6B9',
  [RbaChain.chainId]: '0xB503BA98dF8B35121df3034Bb319A6f71c502D98',
}

export const AIRDROP_FACTORY_ADDRESS = {
  [BSC.chainId]: '0x7442c5433e34Ddf0088d60BeFFefB1536d421904',
  [BSCTestnet.chainId]:'0x4F0Fcf99e7BE47a962599b42dcE3412A613D87FF'
}
