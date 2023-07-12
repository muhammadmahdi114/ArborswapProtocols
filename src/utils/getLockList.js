import { FACTORY_ADDRESS, MULTICALL_ADDRESS, RPC_ADDRESS } from '../config/constants/address'
import TokenLockAbi from 'config/abi/TokenLock.json'
import LockFactoryAbi from '../config/abi/LockFactory.json'
import { ethers } from 'ethers'
import { Contract, Provider, setMulticallAddress } from 'ethers-multicall'
import { DEFAULT_CHAIN, TOTAL_DATA_DISPLAY } from 'config/constants/misc'
import Web3 from 'web3'

const CHAIN_NUMBER = DEFAULT_CHAIN

export const getTokenLockInfos = async (address,chainId) => {
  console.log('chainId getTokenlock infos,', chainId,address)
  setMulticallAddress(chainId, MULTICALL_ADDRESS[chainId])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chainId])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  let calls = []
  for (let i = 0; i < address.length; i++) {
    const tokenContract = new Contract(address[i], TokenLockAbi)
    calls.push(tokenContract.lockInfo())
    calls.push(tokenContract.owner())
  }
  let result = []
  try {
    const resCall = await ethcallProvider.all(calls)
    let a = 0
    let b = 1
    for (let i = 0; i < address.length; i++) {
      const res = {
        address: address[i],
        info: resCall[a],
        owner: resCall[b],
      }
      result.push(res)
      a = a + 2
      b = b + 2
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      data: result,
    }
  }
}

export const getLpLockInfos = async (address,chainId) => {
  console.log('chainId getLpLockInfos,', chainId,address)
  setMulticallAddress(chainId, MULTICALL_ADDRESS[chainId])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chainId])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()
  let calls = []
  for (let i = 0; i < address.length; i++) {
    console.log(address[i], "address[i]")
    const tokenContract = new Contract(address[i], TokenLockAbi)
    calls.push(tokenContract.lockInfo())
    calls.push(tokenContract.owner())
  }
  let result = []
  try {
    const resCall = await ethcallProvider.all(calls)
    let a = 0
    let b = 1
    for (let i = 0; i < address.length; i++) {
      const res = {
        address: address[i],
        info: resCall[a],
        owner: resCall[b],
      }
      result.push(res)
      a = a + 2
      b = b + 2
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.log('error', error)
    return {
      success: false,
      data: result,
    }
  }
}

export const getTokenLockList = async (chainId) => {
  console.log('chainId getTokenlock list', chainId)
  let START = 0,
    END = 0
  try {
    const totalData = await getTotalLock(chainId)
    if (totalData.success) {
      if (totalData.data.token < TOTAL_DATA_DISPLAY) {
        START = 0
        END = totalData.data.token
      } else {
        END = totalData.data.token >= TOTAL_DATA_DISPLAY ? totalData.data.token : TOTAL_DATA_DISPLAY
        START = totalData.data.token >= TOTAL_DATA_DISPLAY ? totalData.data.token - TOTAL_DATA_DISPLAY : 0
      }
    }
  } catch (error) {
    console.log('error', error)
    return {
      success: false,
      data: {},
    }
  }
  if(START === 0 && END === 0) {
    return {
      success: true,
      data: [],
    }
  }
  // setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS[CHAIN_NUMBER])
  // const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[CHAIN_NUMBER])
  // const ethcallProvider = new Provider(provider)
  // await ethcallProvider.init()
  await window.ethereum.enable();
  const web3 = new Web3(window.ethereum);
  const tokenContract = new web3.eth.Contract(LockFactoryAbi, FACTORY_ADDRESS[chainId])
  console.log('tokenContract', tokenContract)
  try {
    // calls.push(tokenContract.getTokenLock(START, END))
    // const [token] = await ethcallProvider.all(calls)
    const token = await tokenContract.methods.getTokenLock(START, END).call()
    return {
      success: true,
      data: token,
    }
  } catch (error) {
    console.log('error', error)
    return {
      success: false,
      data: {},
    }
  }
}

export const getLiquidityLockList = async (chainId) => {
  console.log('chainId getLiquidityLockList', chainId)
  let START = 0,
    END = 0

  try {
    const totalData = await getTotalLock(chainId)

    if (totalData.success) {
      if (totalData.data.liquidity < TOTAL_DATA_DISPLAY) {
        START = 0
        END = totalData.data.liquidity
      } else {
        END = totalData.data.liquidity >= TOTAL_DATA_DISPLAY ? totalData.data.liquidity : TOTAL_DATA_DISPLAY
        START = totalData.data.liquidity >= TOTAL_DATA_DISPLAY ? totalData.data.liquidity - TOTAL_DATA_DISPLAY : 0
      }
    }
  } catch (error) {
    console.log('errorLiquiciditiyiit', error)
    return {
      success: false,
      data: {},
    }
  }
  if(START === 0 && END === 0) {
    return {
      success: true,
      data: [],
    }
  }
  await window.ethereum.enable();
  const web3 = new Web3(window.ethereum);
  const tokenContract = new web3.eth.Contract(LockFactoryAbi, FACTORY_ADDRESS[chainId])
  console.log('tokenContract', tokenContract)
  try {

    const liquidity = await tokenContract.methods.getLiquidityLock(START, END).call()
    return {
      success: true,
      data: liquidity,
    }
  } catch (error) {
    console.log('error', error)
    return {
      success: false,
      data: {},
    }
  }
}

export const getTotalLock = async (chainId) => {
  console.log('chainId getTotalLock', chainId)
  setMulticallAddress(chainId, MULTICALL_ADDRESS[chainId])
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[chainId])
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()

  const tokenContract = new Contract(FACTORY_ADDRESS[chainId], LockFactoryAbi)
  console.log(FACTORY_ADDRESS[chainId])
  let calls = []
  try {
    calls.push(tokenContract.getTotalTokenLock())
    calls.push(tokenContract.getTotalLiquidityLock())

    const [token, liquidity] = await ethcallProvider.all(calls)
    return {
      success: true,
      data: { token: token.toNumber(), liquidity: liquidity.toNumber() },
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      data: { token: 0, liquidity: 0 },
    }
  }
}
