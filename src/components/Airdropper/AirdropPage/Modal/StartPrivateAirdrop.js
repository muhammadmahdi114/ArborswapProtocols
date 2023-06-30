import React, {useState, useMemo, useEffect} from 'react'
import CalendarField from '../../../Launchpad/CreateSale/Subcomponents/CalendarField'
import moment from 'moment'
import PrivateAirdropAbi from 'config/abi/PrivateAirdropAbi.json';
import ERCAbi from 'config/abi/ERC20.json';
import { useEthers, useTokenAllowance, useTokenBalance} from '@usedapp/core';
import { Contract } from '@ethersproject/contracts'
import { useParams} from 'react-router-dom'
import { useModal } from 'react-simple-modal-provider'
import InputField from '../../CreateAirdrop/InputField.js'
import { ethers } from 'ethers'
import {getAirdropInfos} from 'utils/getAirdropList'


export default function StartPrivateAirdrop({ showModal, modal }) {
  const [date, setDate] = useState()
  const [tokenAddress, setTokenAddress] = useState(0)
  const [active, setActive] = useState(false)
  const [totalAmountToAirdrop, setTotalAmountToAirdrop] = useState()
  const { id } = useParams()
  const { account, library, chainId } = useEthers();
  const {chk , setCheckedd} = useState(false);
  const { open: openLoadingModal, close: closeLoadingModal } = useModal('LoadingModal')


  useEffect(() => {
    console.log(date, 'dte')
    if(tokenAddress === 0){
      async function fetchData() {
        try{
          const info = await getAirdropInfos([id]);
          setTokenAddress(info.data[0].info.token)
          setTotalAmountToAirdrop(info.data[0].info.totalAmountToAirdrop)
          setActive(true)
        }catch(error){
          setActive(false)
        }
      }
      fetchData();
    }
  });

  const allowance = useTokenAllowance(tokenAddress, account, id, {
    refresh: 5,
  })

  const balance = useTokenBalance(tokenAddress, account, {
    refresh: 5,
  })

  console.log(allowance, 'allowance')
  console.log(balance, 'balance')
  console.log(totalAmountToAirdrop, 'totalAmountToAirdrop')

  const needApprove = useMemo(() => {
    
      if (typeof allowance === 'undefined') {
        return true
      }
      console.log(totalAmountToAirdrop.gt(allowance), 'lll')
      return totalAmountToAirdrop.gt(allowance)
    
  }, [totalAmountToAirdrop, allowance])

  const isValid = useMemo(() => {
    
      if (typeof balance === 'undefined') {
        return true
      }
  
      return !needApprove && balance.gt(totalAmountToAirdrop)
    

  }, [totalAmountToAirdrop, needApprove, balance])

  console.log(needApprove, 'needApprove')
  console.log(isValid, 'isValid')



  const handleApprove = async () => {
    openLoadingModal()
    const contractERC20 = new Contract(tokenAddress, ERCAbi, library.getSigner())
    try {
      const approval = await contractERC20.approve(id, ethers.constants.MaxUint256)
      await approval.wait()
    } catch (error) {}
    closeLoadingModal()
  }

  const handleStartAirdrop = async() => {
    if(date !== 'undefined'){
      try {
        openLoadingModal()
        const airdrop = new Contract(id, PrivateAirdropAbi, library.getSigner())
        const startAirdrop = await airdrop.start(date)
        await startAirdrop.wait()
        closeLoadingModal()
        showModal(0)
        //navigate(`/locked-assets`)
        return
      } catch (error) {
        closeLoadingModal()
        return false
      }
    }
  }


  return (
    <div className={`w-screen h-screen flex backdrop-blur-[7px] flex-col justify-center items-center bg-[#F2F3F5] dark:bg-dark dark:bg-opacity-40 bg-opacity-40`}>
      <div className="w-[90%] max-w-[420px] rounded-[10px] px-9 py-7 bg-white dark:bg-dark-1">
        <div className="flex justify-between items-center  ">
          <span className="text-dark-text dark:text-light-text font-gilroy font-semibold text-lg">Set Time</span>
          <div className="flex items-center cursor-pointer" onClick={() => showModal(0)}>
            <span className="text-sm font-gilroy font-semibold text-dark-text dark:text-light-text mr-2">Close</span>
            <div className="flex justify-center items-center bg-[#E56060] text-[#E56060] bg-opacity-10 rounded-full w-[15px] h-[15px]">
              &#10005;
            </div>
          </div>
        </div>

        <div className='mt-10'>
            <div className="w-full">
                <CalendarField heading={modal === 3 ? "Starts On (UTC)": "Ends On (UTC)"} setFunction={setDate}  />
            </div>
            {modal === 2 ?             
            <div className="flex items-center mt-10">
                <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 accent-primary-green bg-gray-100 border-gray-300 rounded dark:border-gray-600 focus:outline-none" />
                <label for="default-checkbox" className="ml-3 text-sm font-medium text-dark-text dark:text-gray-300">End Now Instead</label>
            </div> : 
            <div className="flex items-center mt-10">
                <input id="checkbox" type="checkbox" value={chk} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /*onChange={handleChange}*//>
                <label for="default-checkbox" className="ml-3 text-sm font-medium text-[#807373] dark:text-gray-500">Start Now Instead</label>
            </div>}

        </div>
      {active && needApprove && totalAmountToAirdrop.toNumber() !== 0 && <div className="w-full max-w-[420px]  mt-10">
        <button
          className="w-full bg-primary-green text-white py-5 rounded-md font-gilroy font-bold text-xl"
          onClick={handleApprove}
        >
          Approve
        </button>
      </div>
      }

      {active && !needApprove && totalAmountToAirdrop.toNumber() !== 0 &&
        <div className="w-full max-w-[420px]  mt-10">
        <button
          disabled={!isValid}
          className="w-full bg-primary-green text-white py-5 rounded-md font-gilroy font-bold text-xl"
          onClick={handleStartAirdrop}
        >
          Confirm
        </button>
      </div>
      }

      {active && totalAmountToAirdrop.toNumber() === 0 &&
        <div className="w-full max-w-[420px]  mt-10">
        <button
          disabled={true}
          className="w-full bg-primary-green text-white py-5 rounded-md font-gilroy font-bold text-xl"
          
        >
          Allocations are not set
        </button>
      </div>
      }



      {/* <div className="w-full max-w-[420px]  mt-10">
        <button
          className="w-full bg-primary-green text-white py-5 rounded-md font-gilroy font-bold text-xl"
          //onClick={handleStartAirdrop}
        >
          Confirm
        </button>
      </div> */}
    </div>
    </div>
  )
}
