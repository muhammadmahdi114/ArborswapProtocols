import React, { useEffect, useMemo, useState } from 'react'
import PreviewDetails from '../../Common/PreviewDetails'
import PreviewHeader from '../../Common/PreviewHeader'
import Options from './Subcomponents/Options'
import moment from 'moment'
import Web3 from 'web3'
import ERC20Abi from '../../../config/abi/ERC20.json'
import { formatUnits } from 'ethers/lib/utils'
import TokenImage from 'components/Common/TokenImage'
import { formatBigToNum } from 'utils/numberFormat'


export default function Preview({ type, asset, tokenInfo, lpInfo,setEdit ,isAdmin}) {
  const [amount, setAmount] = useState(null)
  const title = useMemo(() => {
    if (type === 'token') {
      return tokenInfo?.symbol
    }
    return `${lpInfo?.token0?.name}/${lpInfo?.token1?.name}`
  }, [type, tokenInfo, lpInfo])

  const description = useMemo(() => {
    if (type === 'token') {
      return tokenInfo?.name
    }
    return `${lpInfo?.token0?.symbol}/${lpInfo?.token1?.symbol}`
  }, [type, tokenInfo, lpInfo])
  console.log(lpInfo,"preview")
  const fetchAmount = async () => {
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(ERC20Abi, asset.token.data.token0.address);
    const decimals = await contract.methods.decimals().call();
    const amount = formatUnits(asset.amount, decimals);
    setAmount(amount);
  }

  // const amount = useMemo(() => {
  //   return asset && tokenInfo ? formatUnits(asset?.info?.amount, tokenInfo?.decimals) * 1 : 0
  // }, [asset, tokenInfo])

  // const totalSupply = useMemo(() => {
  //   return tokenInfo ? formatUnits(tokenInfo?.totalSupply, tokenInfo?.decimals) * 1 : 0
  // }, [tokenInfo])

  // TODO need change
  const amountUSD = 0

  useEffect(() => {
    fetchAmount();
  }, [asset])

  const unlockDate = useMemo(() => {

    return moment.unix(asset?.unlockDate.hex).format('YYYY-MM-DD')
  }, [asset])

  const handleEdit = () => {
    setEdit(true)
  }
  return (
    <div>
    <div className="preview px-9  py-9 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {lpInfo && asset &&
            <div className="flex items-center">
              <TokenImage className="w-10 h-10 relative z-10" src={asset.logoImage} alt="BLANK" />
              {lpInfo && lpInfo.token1.symbol === "WBNB" ?
                <img className="w-8 h-8 -ml-5 mr-3 relative z-0" src="/images/cards/bnb.svg" alt="BNB" />
                : null
              }
            </div>
          }
          <div className="flex flex-col ml-4 font-gilroy">
            <span className="text-dark-text dark:text-light-text  font-bold">{title}</span>

            <span className="text-gray dark:text-gray-dark font-medium mt-2 text-xs">{description}</span>
          </div>
        </div>
          {isAdmin && <Options width={'w-7'} height={'h-7'} color={'[#FAF8F5]'} dark_color={'dark-2'} setEdit={handleEdit}/>}
      </div>

      <PreviewHeader heading={'Lock Details'} />

      <div className="flex flex-col">
        {amount &&
          <PreviewDetails
            name={type === 'token' ? 'Token Locked' : 'LP Locked'}
            value={amount.toLocaleString()}
            icon={null}
          />
        }
        <PreviewDetails name={'Amount in ($)'} value={amountUSD.toLocaleString()} icon={null} />
        <PreviewDetails name={'Locked By'} value={asset?.owner} icon={null} />
        <PreviewDetails name={'Unlock Date'} value={unlockDate} icon={null} />
      </div>

      <PreviewHeader heading={type === 'token' ? 'Token Details' : 'LP Details'} />

      <div className="flex flex-col">
        {type === 'token' ? (
          <>
            <PreviewDetails name="Name" value={tokenInfo?.name} />
            <PreviewDetails name="Symbol" value={tokenInfo?.symbol} />
            <PreviewDetails name="Decimals" value={tokenInfo?.decimals} />
            <PreviewDetails name="Total Supply" value={tokenInfo?.totalSupply.toLocaleString()} />
          </>
        ) : (
          <>
            <PreviewDetails name="Quote Pair" value={lpInfo?.token0.symbol} />
            <PreviewDetails name="Base Pair" value={lpInfo?.token1.symbol} />
            <PreviewDetails name="Symbol" value={description} />
            <PreviewDetails
              name="LP Supply"
              value={
                lpInfo?.totalSupply.toLocaleString()
              }
            />
            <PreviewDetails name="Dex Listed" value={lpInfo?.factory} />
          </>
        )}
      </div>
    </div>
  
    </div>

  )
}
