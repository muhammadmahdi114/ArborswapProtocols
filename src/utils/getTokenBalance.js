import { MULTICALL_ADDRESS, RPC_ADDRESS } from '../config/constants/address'
import ERC20Abi from '../config/abi/ERC20.json'
import { ethers } from 'ethers'
import { Contract, Provider, setMulticallAddress } from 'ethers-multicall'

const CHAIN_NUMBER = 97

export const getTokenBalance = async (account, address,chainId) => {
  console.log("getTokenBalance account, address, chainId", account, address,chainId)
  setMulticallAddress(chainId, MULTICALL_ADDRESS[chainId])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chainId])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()

  const tokenContract = new Contract(address, ERC20Abi)
  let calls = []
  try {
    calls.push(tokenContract.balanceOf(account))

    const [balance] = await ethcallProvider.all(calls)
    return balance.toString()
  } catch (error) {
    return '0'
  }
}
