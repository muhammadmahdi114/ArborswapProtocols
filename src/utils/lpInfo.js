import { MULTICALL_ADDRESS, RPC_ADDRESS } from '../config/constants/address'
import PairAbi from '../config/abi/Pair.json'
import { ethers } from 'ethers'
import { Contract, Provider, setMulticallAddress } from 'ethers-multicall'
import { getTokenSymbolInfo } from './tokenInfo'
import Web3 from 'web3'

const CHAIN_NUMBER = 56

export const getLpInfo = async (address) => {
  console.log("getLpInfo", address)


  await window.ethereum.enable();
  const web3 = new Web3(window.ethereum);
  const pairContract = new web3.eth.Contract(PairAbi,address)
  try {
    const name = await pairContract.methods.name().call();
    const symbol = await pairContract.methods.symbol().call();
    const decimals = await pairContract.methods.decimals().call();
    const totalSupply = await pairContract.methods.totalSupply().call();
    const token0 = await pairContract.methods.token0().call();
    const token1 = await pairContract.methods.token1().call();
    const factory = await pairContract.methods.factory().call();
      
    const token0data = await getTokenSymbolInfo(token0)
    const token1data = await getTokenSymbolInfo(token1)
    return {
      success: true,
      data: {
        name: name,
        symbol: symbol,
        decimals: decimals,
        totalSupply: totalSupply.toString(),
        token0: { ...token0data.data, address: token0 },
        token1: { ...token1data.data, address: token1 },
        factory: factory,
      },
    }
  } catch (error) {
    // alert("Please ensure you are on the Binance Smart Chain network")
    console.log(error, 'error')
    return {
      success: false,
      data: { ...error },
    }
  }
}
