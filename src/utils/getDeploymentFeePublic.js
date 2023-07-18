import Web3 from "web3";
import PublicAbi from '../config/abi/PublicLaunchpadAbi.json';
import { BSC_PUBLIC_FACTORYADDRESS, Public_FACTORYADRESS,Private_FACTORYADRESS } from "config/constants/LaunchpadAddress";

async function getDeploymentFeePublic(saleType) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const chainId = await web3.eth.getChainId();
    let contract = null;
    if (chainId === 56) {
        contract = new web3.eth.Contract(PublicAbi, BSC_PUBLIC_FACTORYADDRESS);
    } else {
        if (saleType === 'standard')
        contract = new web3.eth.Contract(PublicAbi, Public_FACTORYADRESS);
        else 
        contract = new web3.eth.Contract(PublicAbi, Private_FACTORYADRESS);
    }
    const fee = await contract.methods.fee().call();
    console.log(fee, "fee")
    return fee;
}

export default getDeploymentFeePublic;