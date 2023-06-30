import PublicAirdropAbi from '../config/abi/PublicAirdropAbi.json'
import Web3 from 'web3'


async function getAirdropInfo(airdropAddress) {
  console.log(airdropAddress, "airdropAddress")
  try{
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const contract = new web3.eth.Contract(PublicAirdropAbi, airdropAddress);
  const info = await contract.methods.airdropInfo().call();
  console.log(info, "info")
  return info;
  }catch(e){
    console.log(e, "error")
  }
}

export default getAirdropInfo