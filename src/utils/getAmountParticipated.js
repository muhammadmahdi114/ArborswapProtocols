import PublicSaleAbi from "config/abi/PublicSale.json";
import PrivateSaleAbi from "config/abi/PrivateSale.json";
import Web3 from "web3";
//public
async function getAmountParticipated(saleAddress,account,saleType) {
  console.log(saleAddress,account,"saleAddress,account")
  const web3 = new Web3(window.ethereum);
  let contract
  if (saleType === 'private'){
    contract = new web3.eth.Contract(PrivateSaleAbi, saleAddress);
  }
  else{
  contract = new web3.eth.Contract(PublicSaleAbi, saleAddress);
  }
  try { 
    const amount = await contract.methods.userToParticipation(account).call();
    console.log(amount,"amount")
    return amount;
  } catch (err) {
    console.log(err);
  }
}

export default getAmountParticipated;
