import PublicSaleAbi from "config/abi/PublicSale.json";
import PrivateSaleAbi from "config/abi/PrivateSale.json";
import Web3 from "web3";

async function getSaleInfo(saleAddress,saleType="standard") {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    let contract
    if (saleType === 'private') {
      contract = new web3.eth.Contract(PrivateSaleAbi, saleAddress);
    }
    else{
    contract = new web3.eth.Contract(PublicSaleAbi, saleAddress);
    }
    const sale = await contract.methods.sale().call();
    return sale;
  } catch (err) {
    console.log(err);
  }
}

export default getSaleInfo;
