import React, {useState, useEffect, useMemo} from 'react'
import CalendarField from '../../../Launchpad/CreateSale/Subcomponents/CalendarField'
import PublicAirdropAbi from 'config/abi/PublicAirdropAbi.json';
import ERCAbi from 'config/abi/ERC20.json';
import { useEthers, useTokenAllowance, useTokenBalance} from '@usedapp/core';
import { Contract } from '@ethersproject/contracts'
import { useModal } from 'react-simple-modal-provider'
import InputField from '../../CreateAirdrop/InputField.js'
import { ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { useNavigate } from 'react-router-dom'

export default function StartPublicAirdropCreationPage({ decimals, tokenAddress, airdropAddress, showModal, modal }) {
  
  const [date, setDate] = useState()
  const [numberOfClaims, setNumberOfClaims] = useState(0)
  const [claimSize, setSizeofclaims] = useState(0)
  const [active, setActive] = useState(false)
  const [totalAmountToAirdrop, setTotalAmountToAirdrop] = useState()
  const { account, library, chainId } = useEthers();
  const { open: openLoadingModal, close: closeLoadingModal } = useModal('LoadingModal')

  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate()

  const handleOnChangeCheckBox = () => {
    setIsChecked(!isChecked);
  };


  console.log(airdropAddress, 'airdropAddress')
  console.log(tokenAddress, 'tokenAddress')
  console.log(isChecked, 'isChecked')


  useEffect(() => {
    let totalAmount = claimSize * numberOfClaims;
    let bignum = parseUnits(totalAmount.toString(), decimals)
    setTotalAmountToAirdrop(bignum)
    setActive(true)
  }, [claimSize, numberOfClaims]);

  const allowance = useTokenAllowance(tokenAddress, account, airdropAddress, {
    refresh: 5,
  })

  const balance = useTokenBalance(tokenAddress, account, {
    refresh: 5,
  })

  console.log(allowance, 'allowance')
  console.log(balance, 'balance')
  
  console.log(tokenAddress, 'tokenAddress')

  const needApprove = useMemo(() => {
    if(totalAmountToAirdrop > 0){
      if (typeof allowance === 'undefined') {
        return true
      }
      console.log(allowance, 'lll')
      return totalAmountToAirdrop.gt(allowance)
    }
    
  }, [totalAmountToAirdrop, allowance])

  const isValid = useMemo(() => {
    if(totalAmountToAirdrop > 0){
      if (typeof balance === 'undefined') {
        return true
      }
  
      return !needApprove && balance.gt(totalAmountToAirdrop)
    }

  }, [totalAmountToAirdrop, needApprove, balance])

  console.log(needApprove, 'needApprove')
  console.log(isValid, 'isValid')
  console.log((Math.floor(Date.now() / 1000) + 120), 'Math.floor(Date.now() / 1000)')



  const handleApprove = async () => {
    openLoadingModal()
    const contractERC20 = new Contract(tokenAddress, ERCAbi, library.getSigner())
    try {
      const approval = await contractERC20.approve(airdropAddress, ethers.constants.MaxUint256)
      await approval.wait()
      closeLoadingModal()
    } catch (error) {closeLoadingModal()}
  }

  const handleStartAirdrop = async() => {
      if(isChecked){
        setDate(Math.floor(Date.now() / 1000) + 60)
      }

      if(date !== 'undefined'){
        try {
          openLoadingModal()
          const airdrop = new Contract(airdropAddress, PublicAirdropAbi, library.getSigner())
          let claimSizeBigInt = parseUnits(claimSize.toString(), decimals)
          let numberOfClaimsBigInt = parseUnits(numberOfClaims.toString(), 1)
          const startAirdrop = await airdrop.start(date, numberOfClaimsBigInt, claimSizeBigInt)
          await startAirdrop.wait()
          navigate(`/airdropper/airdrops/${airdropAddress}`)
          closeLoadingModal()
          showModal(0)
          return
        } catch (error) {
          closeLoadingModal()
          return false
        }
      }
  }


  return (
    <div className={`w-full flex flex-col items-center bg-[#F2F3F5] dark:bg-dark bg-opacity-40`}>
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
                <CalendarField heading={"Starts On (UTC)"} setFunction={setDate}  />
            </div>

            <div className="flex items-center mt-10">
                <input id="checkbox" type="checkbox" value="" checked={isChecked}
                   onChange={handleOnChangeCheckBox} 
                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label for="checkbox" className="ml-3 text-sm font-medium text-[#807373] dark:text-gray-500">Start Now Instead</label>
            </div>

        </div>
        <div className='mt-10 w-full'>
              <InputField 
                  heading={"Number of Claims"}
                  value={numberOfClaims}
                  changeState={setNumberOfClaims}
                  placeholder={""}
              />
          </div>
              <div className='mt-10 w-full flex'>
                  <InputField 
                      heading={"Size of Claims"}
                      value={claimSize}
                      changeState={setSizeofclaims}
                      placeholder={""}
                  />
              </div>
      {active && needApprove &&
        <div className="w-full max-w-[420px]  mt-10">
        <button
          className="w-full bg-primary-green text-white py-5 rounded-md font-gilroy font-bold text-xl"
          onClick={handleApprove}
        >
          Approve
        </button>
      </div> }       

      {active && !needApprove&&
        <div className="w-full max-w-[420px]  mt-10">
        <button
          className="w-full bg-primary-green text-white py-5 rounded-md font-gilroy font-bold text-xl"
          onClick={handleStartAirdrop}
        >
          Confirm
        </button>
      </div>}
    </div>
    </div>
  )
}