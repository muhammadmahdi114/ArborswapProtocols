import React, { useState, useEffect } from 'react'
import Preview from './Preview'
import UserPanel from './UserPanel'
import AdminPanel from "./Admin"
import { formatUnits } from 'ethers/lib/utils'
import getAirdropInfo from 'hooks/useAirdropInfo'
import useTokenInfo from 'hooks/useTokenInfo'
import { useParams } from 'react-router-dom'
import { formatBigToNum } from '../../../utils/numberFormat'



export default function AirdropPageBase({ status , airdrop, showModal, admin }) {
  const [upcoming] = useState(true)
  const [whitelisted] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalDistributed, setTotalDistributed] = useState(0)
  const [time, setTime] = useState();
  const [remaining, setRemaining] = useState(0)
  const [filledPerc, setFilledPerc] = useState(0)
  const [airdropInfo, setAirdropInfo] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    async function getInfo() {
      const info = await getAirdropInfo(id)
      setAirdropInfo(info)
    }
    getInfo()
  }, [id])


  function handleSetRemaining(allocation){
    let filledPercNum = ((remaining - allocation)/totalAmount)*100
    setRemaining(remaining - allocation);
    setFilledPerc(filledPercNum)
  }
  useEffect(() => {
    console.log(airdropInfo, 'airdropInfo')
    if (airdropInfo===null || airdropInfo === undefined) {
      return
    }
   
    let totalAmountNumber = Number(formatUnits(airdropInfo.totalAmountToAirdrop, 18));
    let totalDistributedNumber = Number(formatUnits(airdropInfo.totalAmountDistributed, 18));
    let remainingNum = totalAmountNumber - totalDistributedNumber;
    let filledPercNum = (remainingNum/totalAmountNumber)*100
    setTotalAmount(totalAmountNumber)
    setTotalDistributed(totalDistributedNumber)
    setRemaining(remainingNum)
    setFilledPerc(filledPercNum)
    // console.log(totalAmountNumber, 'totalAmountNumber')
    // console.log(totalDistributedNumber, 'totalDistributedNumber')
    // console.log(remainingNum, 'remainingNum')
    // console.log(filledPercNum, 'filledPercNum')


    
  }, [airdropInfo])


  useEffect(() => {
   
    if (airdropInfo === null) {
      return
    }
   
    var date;
    var formattedTime;
  
    
    if(airdropInfo.startTime.toNumber() === 0){
        date = '';
        formattedTime = 'Not started yet';
    }else{
      date = new Date(airdrop.info.startTime.toNumber() * 1000);
      var hours = date.getHours();
      
      var minutes = "0" + date.getMinutes();

      var seconds = "0" + date.getSeconds();

      formattedTime = hours + ':' + minutes.substr(-2) + ' ' + date.toDateString()
      setTime(formattedTime)
    }


    
  }, [airdropInfo])
  

  console.log(remaining, 'remainng page base')
  

  return (
    airdrop && airdropInfo && (
      <div className="w-full flex justify-center">
        <div className="w-full px-4 md:px-0 md:flex md:w-10/12 md:gap-7">
          <div className="w-full md:w-[65%] bg-white dark:bg-dark-1 rounded-[10px]">
            <Preview
              name={airdrop.info.description[7]}
              icon={airdrop.info.description[0]}
              is_private={airdrop.info.isPrivate}
              airdrop={airdrop}
              tags={['Web3', 'nn']}
              description={airdrop.info.description[1]}
              address={airdrop.address}
              tokenAddress={airdrop.info.token}
              starts_on={time}
              ends_on={airdrop.info.startTime.toNumber()}
              admin={admin}
            />
          </div>

          <div className="mt-14 md:mt-0 md:w-[35%] ">
        
            {
              admin ? <AdminPanel airdrop={airdrop} whitelist_address={airdrop.info.numberWLAddresses.toNumber()} participants={airdrop.info.numberOfParticipants.toNumber()} amount={totalAmount} allocated={1} showModal={showModal} upcoming={upcoming} Private={airdrop.info.isPrivate} started = {airdrop.started}/> : 
              <UserPanel handleSetRemaining={handleSetRemaining} amount={totalAmount} icon={airdrop.info.description[0]}
              min_allocation={airdrop.info[0].toNumber()} status={status}
              filled_percent={filledPerc} ends_on={airdrop.info[0].toNumber()}  
              whitelisted={whitelisted} whitelist_address={airdrop.info.numberWLAddresses.toNumber()} is_private={airdrop.info.isPrivate} remaining={remaining}/>
            }
          </div>
        </div>
      </div>
    )
  )
}
