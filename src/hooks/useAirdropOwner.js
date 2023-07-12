import PublicAirdropAbi from '../config/abi/PublicAirdropAbi.json'

import { Contract } from '@ethersproject/contracts'


import { useCall} from "@usedapp/core"
import Web3 from 'web3'


async function getAirdropOwner(airdropAddress) {
  console.log(airdropAddress, "getAirDropOwner")
  try{
  await window.ethereum.enable();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(PublicAirdropAbi, airdropAddress);
  const owner = await contract.methods.owner().call();
  return owner;
  } catch (error) {
    console.log(error)
  }
}

export default getAirdropOwner