import React, { useMemo, useState, useEffect } from 'react'
import { formatEther } from 'ethers/lib/utils'
import getFeeInfo from 'hooks/useFeeInfo'
import { useDefaultChainId } from 'config/useDefaultChainId'

export default function FeeText({ type }) {
  const [feeInfo, setFeeInfo] = useState(null)
  const chainId = useDefaultChainId()
  useEffect(() => {
    async function fetchData() {
      console.log("Fee text chainId", chainId)
      const info = await getFeeInfo(chainId)
      console.log("Fee text info", info)
      setFeeInfo(info)
    }
    fetchData()
  }, [chainId])
  

  const selectedFee = useMemo(() => {
    if (feeInfo === null) {
      return ''
    }
    let fee = feeInfo?.normalFee

    if (type === 'lptoken') {
      fee = feeInfo?.normalFee
    }
    return (formatEther(fee) * 1).toLocaleString()
  }, [feeInfo, type])

  return <>{selectedFee}</>
}
