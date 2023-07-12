import { Contract } from "ethers"
import PublicAirdropAbi from '../config/abi/PublicAirdropAbi.json'

import { useCall } from "@usedapp/core"
import Web3 from "web3"

async function getIsOwner(airdropAddress, account) {
  console.log(airdropAddress, "getIsOwner")
  await window.ethereum.enable();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(PublicAirdropAbi, airdropAddress);
  const owner = await contract.methods.isOwner(account).call();
  return owner;
}

export default getIsOwner