import React, { useEffect, useState } from 'react'
import { approveTokens, deployPublicSaleERC } from 'utils/deploySale';
import { BACKEND_URL, PublicErc_FACTORYADRESS, RBA_ADDRESS, USDC_ADDRESS, USDT_ADDRESS } from "config/constants/LaunchpadAddress";
import axios from 'axios';
import getDeploymentFeePublic from 'utils/getDeploymentFeePublic';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import { getTokenInfo } from 'utils/tokenInfo';


const images = [
  "https://logos-download.com/wp-content/uploads/2019/11/Namecoin_NMC_Logo_1-700x700.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Bitsane_Logo-1536x1528.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Credits_CS_Logo-1536x1536.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Arweave_AR_Logo-1536x1536.png",
  "https://logos-download.com/wp-content/uploads/2022/01/DigitalNote_Logo-1536x1536.png",
  "https://logos-download.com/wp-content/uploads/2018/05/Peercoin_Logo_vertically-1385x1536.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Hive_Logo-1536x1326.png",
  "https://logos-download.com/wp-content/uploads/2022/01/BitCore_BTX_Logo-1536x1536.png",
  "https://logos-download.com/wp-content/uploads/2019/11/FunFair_FUN_Logo-700x698.png",
  "https://logos-download.com/wp-content/uploads/2018/07/Mooncoin_logo_cube-700x700.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Beam_Logo-1536x1536.png",
  "https://logos-download.com/wp-content/uploads/2022/01/GINcoin_Logo-1536x1536.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Bitbank_Logo-180x210.png",
  "https://logos-download.com/wp-content/uploads/2022/01/NEAR_Protocol_Logo-210x210.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Torex_Logo-210x210.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Gas_Logo_full-210x83.png",
  "https://logos-download.com/wp-content/uploads/2022/01/MOAC_Logo-210x210.png",
  "https://logos-download.com/wp-content/uploads/2019/01/Aware_Logo-199x210.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Everex_EVX_Logo-210x210.png",
  "https://logos-download.com/wp-content/uploads/2022/01/NAGA_NGC_Logo-210x210.png",
  "https://logos-download.com/wp-content/uploads/2018/05/Primecoin_logo_yellow-700x700-1-210x210.png",
  "https://logos-download.com/wp-content/uploads/2022/01/HyperCash_Logo-210x161.png",
  "https://logos-download.com/wp-content/uploads/2019/01/Coinpulse_Logo-210x210.png",
  "https://logos-download.com/wp-content/uploads/2022/01/Everex_EVX_Logo-210x210.png",
];

const currencies = [
  {
    id: 2,
    name: "Roburna",
    symbol: "RBA",
    icon: "/images/cards/arb.svg",
    address: RBA_ADDRESS,
  },
  {
    id: 3,
    name: "USD Coin",
    symbol: "USDC",
    icon: "/images/cards/gusd.svg",
    address: USDC_ADDRESS,
  },
  {
    id: 4,
    name: "Tether",
    symbol: "USDT",
    icon: "/images/cards/usdt.svg",
    address: USDT_ADDRESS,
  },
];

export default function CreateSaleTest() {
  const [deploymentFee, setDeploymentFee] = useState(0.0);
  const [deployFee, setDeployFee] = useState(null);
  const { account, library, chainId } = useEthers();
  const [contractAddress, setContractAddress] = useState(null);
  const [status, setStatus] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [saleCurrency, setSaleCurrency] = useState(null);
  const [saleToken, setSaleToken] = useState(null);
  const randomNumber = Math.floor(Math.random() * 24) + 1;

  async function getFee() {
    const res = await getDeploymentFeePublic()
    setDeployFee(res)
    setDeploymentFee(ethers.utils.formatEther(res))
  }

  const saleData = {
    website: "https://roburna.com",
    type: "standard",
    github: "https://github.com/FahadZaheerfzr",
    twitter: "https://twitter.com/roburna",
    linkedin: "https://www.linkedin.com/in/fahad-zaheer-78127a170",
    discord: "https://discord.com/channels/789402563035660308/1101022526550847508",
    telegram: "https://t.me/roburna",
    youtube: "",
    image: images[randomNumber],
    description: "The Launchpad Sale is an exciting event that brings together a wide array of innovative products and services, providing a platform for entrepreneurs, startups, and established companies to showcase their latest offerings to a discerning audience. This meticulously organized sale serves as a launchpad for new ventures, enabling them to gain exposure and reach a larger customer base.",
    tags: "Public, ERC20",
    name: "Test Sale"
  }

  const saleStartTime = new Date(new Date().getTime() + 10 * 60000);
  const startTime = Math.floor(saleStartTime.getTime() / 1000);
  const saleEndTime = new Date(new Date().getTime() + 16 * 60 * 60000);
  const endTime = Math.floor(saleEndTime.getTime() / 1000);
  // get random number between 1 and 24

  


  const deployERC20Sale = async () => {
    const saleObject = {
      minAllocation: "5",
      maxAllocation: "20",
      amountLiquidity: "60",
      listing: "10",
      lockup: "1000",
      presalePrice: "20",
      endDate: endTime,
      startDate: startTime,
      hardCap: "20",
      softCap: "10",
      unsoldToken: "Burn",
      currency: saleCurrency,
      dex: {
        name: "PanCakeSwap",
        icon: "/images/cards/pancake.svg",
      },
      whiteisting: false,
    }
    setSaleToken(saleObject)
    setDeploying(true);

  
    const tokenInfo = await getTokenInfo(chainId, contractAddress);
    console.log(tokenInfo)
    if (!tokenInfo.success) return alert("Invalid Token Address");
    const token = {
      tokenAddress: contractAddress,
      tokenName: tokenInfo.data.name,
      tokenSymbol: tokenInfo.data.symbol,
      tokenDecimals: tokenInfo.data.decimals,
      tokenSupply: tokenInfo.data.totalSupply,
    }
    const res = await approveTokens(library, token, PublicErc_FACTORYADRESS);

    if (res) {
      const finalSaleObject = await deployPublicSaleERC(
        token,
        saleObject,
        library,
        account,
        deploymentFee,
        saleData,
        chainId,
      );

      if (finalSaleObject) {
        await axios.post(
          `${BACKEND_URL}/api/sale`,
          {
            sale: finalSaleObject,
          },
          {
            withCredentials: true,
          }
        );
        setStatus("Sale Deployed Successfully")
      }
    }
  };

  useEffect(() => {
    getFee()
  }, []);

  const handleClick = async () => {
    if (deployFee && contractAddress && saleCurrency) {
      deployERC20Sale();

    } else {
      alert('Please enter contract address and select sale currency')
    }
  }


  return (
    <div>
      {status !== null ? status :
        deploying ? 
        <div className='m-5'>
          Deploying sale with following parameters...
          {JSON.stringify(saleToken)}
        </div> 
        :
        <div>
          <input
            className='w-80 border p-2 m-5 border-black'
            placeholder='Enter Contract Address'
            type="text"
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <button className='bg-primary-green p-2 text-white'
            onClick={handleClick}>Deploy</button>
          <div className='m-5'>
            Sample Contract Address USDT: <br />
            0x9b61dC9235E015b67E8C706C68cf735B09D3e633
          </div>

          <div className='m-5'>
            Currency Selected: {saleCurrency ? saleCurrency.symbol : 'None'}
          </div>
          <div className='m-5'>
            {currencies.map((currency) => (
              <button className='bg-primary-green p-2 text-white m-2 rounded-md'
                onClick={() => setSaleCurrency(currency)}>{currency.symbol}</button>
            ))}
          </div>
        </div>
      }

    </div>
  )
}
