import PublicAbi from '../config/abi/PublicLaunchpadAbi.json';
import { BSC_PUBLIC_FACTORYADDRESS, Public_FACTORYADRESS } from "config/constants/LaunchpadAddress";
import Web3 from 'web3';
import { parseEther, parseUnits } from 'ethers/lib/utils';



async function getCalcMax(saleObject, token, chainId) {
  const web3 = new Web3(window.ethereum);
  let contract = null;
  if (chainId === 56) {
    contract = new web3.eth.Contract(PublicAbi, BSC_PUBLIC_FACTORYADDRESS);
  } else {
    contract = new web3.eth.Contract(PublicAbi, Public_FACTORYADRESS);
  }
  try {
    const calcMax = await contract.methods.calculateMaxTokensForLiquidity(
      parseEther(saleObject.hardCap.toString()).toString(),
      (saleObject.amountLiquidity * 100).toString(),
      parseUnits(saleObject.listing.toString(), token.tokenDecimals).toString(),
    ).call();
    return calcMax;
  }
  catch (err) {
    console.log(err)
  }
}


export default getCalcMax;
