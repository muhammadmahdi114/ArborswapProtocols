import React, { useMemo } from 'react'
import Timer from './Timer/Timer'
import { formatUnits } from 'ethers/lib/utils'
import TokenImage from 'components/Common/TokenImage'
export default function Amount({ type, asset, tokenInfo, lpInfo }) {
  const amount = useMemo(() => {
    return asset && tokenInfo ? formatUnits(asset?.info?.amount, tokenInfo?.decimals) * 1 : 0
  }, [asset, tokenInfo])

  return (
    <div className="flex flex-col p-9 font-gilroy bg-white dark:bg-dark-1 rounded-[20px]">
      <span className="text-sm font-medium text-gray dark:text-gray-dark">Amount</span>

      <div className="flex items-center mt-3">
      {lpInfo && asset &&
            <div className="flex items-center">
              <TokenImage className="w-10 h-10 relative z-10" src={asset.info.logoImage} alt="BLANK" />
              {lpInfo && lpInfo.token1.symbol === "WBNB" ?
                <img className="w-8 h-8 -ml-5 mr-3 relative z-0" src="/images/cards/bnb.svg" alt="BNB" />
                : null
              }
            </div>
          }

        <span className="text-2xl font-bold text-dark-text dark:text-light-text ml-3">{amount.toLocaleString()}</span>
      </div>

      <div className="flex mt-10">
        <button className="w-full cursor-pointer bg-primary-green bg-opacity-100 hover:bg-opacity-90 disabled:bg-opacity-60  rounded-md text-white dark:text-white font-bold py-4">
          Claim
        </button>
      </div>

      <div className="flex justify-center mt-7">
        <span className="text-sm font-medium text-gray dark:text-gray-dark">Unlocks in</span>
      </div>

      <Timer date={asset?.info?.unlockDate?.toNumber() * 1000} />
    </div>
  )
}
