import { MULTICALL_ADDRESS, RPC_ADDRESS } from '../config/constants/address'
import PairAbi from '../config/abi/Pair.json'
import { ethers } from 'ethers'
import { Contract, Provider, setMulticallAddress } from 'ethers-multicall'
import { getTokenSymbolInfo } from './tokenInfo'
import Web3 from 'web3'

const CHAIN_NUMBER = 56

export const getLpInfo = async (address) => {
  // setMulticallAddress(CHAIN_NUMBER, MULTICALL_ADDRESS[CHAIN_NUMBER])
  // const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS[CHAIN_NUMBER])
  // const ethcallProvider = new Provider(provider)
  // await ethcallProvider.init()
  await window.ethereum.enable();
  const web3 = new Web3(window.ethereum);
  const pairContract = new web3.eth.Contract(PairAbi,address)
  try {
    const token0 = await pairContract.methods.token0().call();
    const token1 = await pairContract.methods.token1().call();
      
    const token0data = await getTokenSymbolInfo(token0)
    const token1data = await getTokenSymbolInfo(token1)
    return {
      success: true,
      data: {
        token0: { ...token0data.data, address: token0 },
        token1: { ...token1data.data, address: token1 },
      },
    }
  } catch (error) {
    alert("Please ensure you are on Mainnet")
    return {
      success: false,
      data: { ...error },
    }
  }
}
