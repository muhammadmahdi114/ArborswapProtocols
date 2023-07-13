import React, { useState, useEffect } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { Link } from 'react-router-dom'
import ListInfo from './ListInfo'
import { getLpInfo } from 'utils/lpInfo'
import TokenImage from 'components/Common/TokenImage'
import Web3 from 'web3'
import ERC20Abi from '../../../config/abi/ERC20.json'

export default function List({ data, token = false }) {
  const [tokenData, setTokenData] = useState(null)
  const [date, setDate] = useState(null)
  const [amount, setAmount] = useState(null)
  const getTokenData = async () => {
    setTokenData(data.token.data)
  }

  const fetchAmount = async () => {
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(ERC20Abi, data.token);
    const decimals = await contract.methods.decimals().call();

    const amount = formatUnits(data.amount, decimals);
    setAmount(amount);
  }



  useEffect(() => {
    if (!token && data) {
      fetchAmount();;
      getTokenData()
    }
  }, [data, token])


  return (
    <div className="w-full flex items-center justify-between bg-white dark:bg-dark-1 rounded-[10px] py-5 px-6">
      <div className="flex items-center">
            
            <TokenImage className="w-10 h-10 relative z-10" src={data.logoImage} alt="BLANK" />
            {tokenData && tokenData.token1.symbol === "WBNB" ? 
              <img className="w-8 h-8 -ml-5 mr-3 relative z-0" src="/images/cards/bnb.svg" alt="BNB" />
              : null
            }
          </div>

      <div
        className={`flex flex-col justify-center font-bold font-gilroy text-dark-text dark:text-light-text ${
          tokenData ? 'ml-[10px]' : 'ml-0'
        }`}
      >
        <span>{tokenData ? tokenData.token0.symbol + "/" + tokenData.token1.symbol : ''}</span>
        <span className="text-xs font-medium text-dim-text dark:text-dim-text-dark">{token}</span>
      </div>
        {amount && 
      <ListInfo heading={'Amount'} value={(amount.toString().toLocaleString().substring(0,8))} />
        }
        {date && 
      <ListInfo heading={'Unlocks on'} value={new Date(date)} />
        }
      <div className="flex items-center">
        <Link to={`/locked-assets/${token ? 'token' : 'lp-token'}/${data.address}`}>
          <img className="rotate-180" src="/images/sidebar/arrow-left.svg" alt="arrow-right" />
        </Link>
      </div>
    </div>
  )
}
