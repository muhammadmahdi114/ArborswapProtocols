import React, { useState, useEffect } from 'react'
import { getLiquidityLockList, getTokenLockList, getTokenLockInfos, getLpLockInfos } from 'utils/getLockList'
import BaseLayout from '../../components/BaseLayout/BaseLayout'
import HomeLayout from '../../components/HomeLayout'
import LockerBase from '../../components/Locker'
import SheildSecuritySVG from '../../svgs/Sidebar/shield_security'
import { useDefaultChainId } from 'config/useDefaultChainId'
import { useModal } from 'react-simple-modal-provider'
export default function Locker() {
  const [cardFormat, setCardFormat] = useState('grid')
  const [itemSelected, setItemSelected] = useState('liquidity')
  const [ready, setReady] = useState(false)
  const [tokenList, setTokenList] = useState([])
  const [liquidityList, setLiquidityList] = useState([])

  const chainId=useDefaultChainId()
  console.log('chainId',chainId)
  const { open: openLoadingModal, close: closeLoadingModal } =
  useModal("LoadingModal");
  const handleFetch = async () => {
    setReady(false)
    openLoadingModal()
    try {
      const token = await getTokenLockList(chainId)
      console.log(token,"token")
      const liquidity = await getLiquidityLockList(chainId)
      console.log(liquidity,"liquidity")
      if (token.success) {
        const info = await getTokenLockInfos(token.data,chainId)
        console.log("tokenInfo",info)
        if (info.success) {
          setTokenList(info.data)
          
        }
      }
      if (liquidity.success) {
        const infoLp = await getLpLockInfos(liquidity.data,chainId)
        console.log("liquidityInfo",infoLp)
        if (infoLp.success) {
          setLiquidityList(infoLp.data)
        }
      }
      closeLoadingModal()
      setReady(true)
      
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    handleFetch()
  }, [chainId])
  return (
    <BaseLayout
      title={'Locker'}
      page_name={'Locked Assets'}
      title_img={<SheildSecuritySVG className="md:hidden fill-dim-text" />}
    >
      <HomeLayout
        cardFormat={cardFormat}
        setCardFormat={setCardFormat}
        itemSelected={itemSelected}
        setItemSelected={setItemSelected}
        locker
      >
        {ready ? (
          <LockerBase
            cardFormat={cardFormat}
            itemSelected={itemSelected}
            tokenList={tokenList}
            liquidityList={liquidityList}
          />
        ) : (
          <></>
        )}
      </HomeLayout>
    </BaseLayout>
  )
}
