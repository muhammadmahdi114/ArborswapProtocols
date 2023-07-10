import { MULTICALL_ADDRESS, RPC_ADDRESS } from '../config/constants/address'
import ERC20Abi from '../config/abi/ERC20.json'
import { ethers } from 'ethers'
import { Contract, Provider, setMulticallAddress } from 'ethers-multicall'
import Web3 from 'web3'

const CHAIN_NUMBER = 56

export const getTokenInfo = async (chainId, address) => {
  console.log('chainId getTokenInfo,', chainId,address)
  setMulticallAddress(chainId, MULTICALL_ADDRESS[chainId])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chainId])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  const tokenContract = new Contract(address, ERC20Abi)
  let calls = []
  try {
    calls.push(tokenContract.name())
    calls.push(tokenContract.symbol())
    calls.push(tokenContract.decimals())
    calls.push(tokenContract.totalSupply())

    const [name, symbol, decimals, totalSupply] = await ethcallProvider.all(calls)
    return {
      success: true,
      data: {
        name: name,
        symbol: symbol,
        decimals: decimals,
        totalSupply: totalSupply.toString(),
      },
    }
  } catch (error) {
    console.log(error, "error")
    return {
      success: false,
      data: {},
    }
  }
}

export const getTokenSymbolInfo = async (address) => {
  try {
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(ERC20Abi,address)
    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    return {
      success: true,
      data: {
        name: name,
        symbol: symbol,
      },
    }
  } catch (error) {
    return {
      success: false,
      data: {},
    }
  }
}
