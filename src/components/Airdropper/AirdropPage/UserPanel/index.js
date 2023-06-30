import React, { useEffect, useState } from 'react';
import Timer from '../../../LockedAsset/Amount/Timer/Timer';
import { useNavigate, useParams } from 'react-router-dom'
import PublicAirdropAbi from 'config/abi/PublicAirdropAbi.json';
import { useEthers} from '@usedapp/core';
import { ethers } from 'ethers';
import { useModal } from 'react-simple-modal-provider'
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from 'ethers/lib/utils';
import PrivateAirdropAbi from 'config/abi/PrivateAirdropAbi.json';
import { getUserParticipationPrivate, getUserParticipationPublic } from 'utils/getAirdropList'
import {useAirdropIsWL, useAirdropGetParticipation, useAirdropIsClaimed} from 'hooks/useAirdropInfo'
import {useAirdropClaimSize, useAirdropNumberOfClaims} from 'hooks/useAirdropNumberOfClaimsAndClaimSize.js'


export default function UserPanel({handleSetRemaining, is_private, amount, icon, filled_percent, ends_on, status, whitelist_address, whitelisted , remaining}) {
    const { id } = useParams()
    const [isAirdropClaimed, setIsAirdropClaimed] = useState(false);
    const [remainingAllocations, setRemainingAllocations] = useState();
    const [isWL, setIsWL] = useState();
    const [allocation, setAllocation] = useState();
    const {library, chainId, account, active } = useEthers()   
    const { open: openLoadingModal, close: closeLoadingModal } = useModal('LoadingModal')
    
    // const claimSize = useAirdropClaimSize(id)
    // const numberOfClaims = useAirdropNumberOfClaims(id)

     console.log(remaining, 'remainng')
    // console.log(numberOfClaims, 'numberOfClaims')
    
    

    

    useEffect(() => {
        async function fetchUserInfo() {

            if(account !== undefined && is_private){
                const info = await getUserParticipationPrivate(id, account);
                setIsWL(info.data[0].isWL)
                setAllocation(formatUnits(info.data[0].participation.allocation,18))
                setIsAirdropClaimed(info.data[0].participation.claimed) 
            }else if(account !== undefined && !is_private){
                const info = await getUserParticipationPublic(id, account);
                setIsWL(false)
                setAllocation(formatUnits(info.data[0].portionSize, 18))
                setIsAirdropClaimed(info.data[0].isAirdropClaimed)
            }
        }
        try {
            fetchUserInfo()
        } catch (error) {
            console.log(error.message)
        } 


    })
    
    const handleClaim = async () => {

        const contract = new Contract(id, PublicAirdropAbi, library.getSigner())
        try {
          openLoadingModal()
          const claim = await contract.claim()
          await claim.wait()
          setIsAirdropClaimed(true)
          //debugger
          handleSetRemaining(allocation)
          if(!is_private){
            setRemainingAllocations(amount/allocation.toNumber())
          }
          closeLoadingModal()
          return
        } catch (error) {
          console.log(error.message)
          closeLoadingModal()
          return false
        }
    }

    return (
        <div className="p-9 bg-white dark:bg-dark-1 rounded-[20px]">
            <div className="w-full flex justify-between">
                <span className="text-gray dark:text-gray-dark text-sm font-medium">Amount</span>
            </div>

            <div className="mt-3 flex">
                <img src={icon}  className="w-7 h-7" />

                <div className="ml-3">
                    <span className="text-dark-text dark:text-light-text text-2xl font-bold">{amount.toLocaleString()}</span>
                </div>
            </div>

            {(remainingAllocations !== undefined && !is_private) && <div className="mt-7 flex justify-between">
                <span className='font-medium text-sm text-gray dark:text-gray-dark'>
                    Remaining Allocations
                </span>
                <span className='font-bold text-sm text-dark-text dark:text-light-text'>
                    {remainingAllocations.toLocaleString()} 
                </span>
            </div>}
            
            {(allocation !== undefined && account !== undefined) && <div className="mt-7 flex justify-between">
                <span className='font-medium text-sm text-gray dark:text-gray-dark'>
                    Your Allocation
                </span>
                <span className='font-bold text-sm text-dark-text dark:text-light-text'>
                    {allocation.toLocaleString()} 
                </span>
            </div>}

            {is_private && <div className="mt-5 flex justify-between">
                <span className='font-medium text-sm text-gray dark:text-gray-dark'>
                    Whitelisted address
                </span>
                <span className='font-bold text-sm text-dark-text dark:text-light-text'>
                    {whitelist_address.toLocaleString()}
                </span>
            </div>}

            <div className="flex items-center justify-between mt-5">
                <span className="text-xs  text-gray dark:text-gray-dark">
                    Remaining
                </span>

                <span className="text-xs  text-dim-text dark:text-dim-text-dark">
                    {`${remaining.toLocaleString()} `}
                </span>
            </div>

            {amount !== 0? ( <div className="w-full bg-[#F5F1EB] dark:bg-dark-3 rounded-[5px] h-[18px] mt-[6px]">
                <div
                    className={`h-18px filled rounded-[5px] pr-2 flex justify-end items-center text-xs text-white`}
                    style={{ width: `${Math.floor(filled_percent)}%` }}
                >
                    {Math.floor(filled_percent)}%
                </div>
            </div>) : (
                <div className="w-full bg-[#F5F1EB] dark:bg-dark-3 rounded-[5px] h-[18px] mt-[6px]">
                <div
                    className={`h-18px filled rounded-[5px] pr-2 flex justify-end items-center text-xs text-white`}
                    style={{ width: `${'Not Started yet'}` }}
                >
                    {'Not Started yet'}
                </div>
            </div>
            )}

            
            <div className="flex flex-col mt-10">
                {account === undefined && <span className="text-sm font-medium mb-5 text-[red] text-center">Connect your Wallet</span>}
                {(!isWL && is_private && account !== undefined) && <span className="text-sm font-medium mb-5 text-[red] text-center">Your Wallet is not Whitelisted</span>}
                {account !== undefined && ((isWL && is_private) || (!is_private)) && (isAirdropClaimed !== true) && <button className={`w-full ${( (isWL && is_private) || (isAirdropClaimed !== true && !is_private && status !== 'Timed' && status !== 'Ended'))? "bg-primary-green" : "bg-primary-green bg-opacity-50 dark:bg-dim-text-dark"} rounded-md text-white font-bold py-4`}
                    disabled={status === 'Timed' || status === 'Ended'}
                    onClick={handleClaim}>
                    Claim Airdrop
                </button>}
                {isAirdropClaimed &&
                    <button className={`w-full ${ "bg-primary-green bg-opacity-50 dark:bg-dim-text-dark"} rounded-md text-white font-bold py-4`}>
                    Claimed
                </button>
                }
            </div>
     
        </div>
    )
}
