import React, { useMemo, useState, useEffect } from 'react'
import { formatEther } from 'ethers/lib/utils'
import getFeeInfo from 'hooks/useFeeInfo'

export default function FeeText({ type }) {
  const [feeInfo, setFeeInfo] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const info = await getFeeInfo()
      setFeeInfo(info)
    }
    fetchData()
  }, [])
  

  const selectedFee = useMemo(() => {
    if (feeInfo === null) {
      return ''
    }
    let fee = feeInfo.normalFee

    if (type === 'lptoken') {
      fee = feeInfo.normalFee
    }
    return (formatEther(fee) * 1).toLocaleString()
  }, [feeInfo, type])

  return <>{selectedFee}</>
}
