import React, { useState, useEffect } from 'react'
import Live from './StartedNotLive'
import Ended from './StartedLive'
import NotStartedPublic from './NotStartedPublic'
import NotStartedPrivate from './NotStartedPrivate'
import {useAirdropIsCancelled, useAirdropIsStarted, useAirdropIsEmpty} from 'hooks/useAirdropStatus'
import { useParams } from 'react-router-dom'

const AdminPanel = ({
    airdrop,
    whitelist_address,
    participants,
    amount,
    allocated,
    showModal,
    Private
}) => {
    const { id } = useParams()
    const isCancelled = useAirdropIsCancelled(id);
    const isStarted = useAirdropIsStarted(id);
    const isEmpty = useAirdropIsEmpty(id);
    const [status, setStatus] = useState('');

    function handleStatusChange(newStatus) {
        //debugger
        setStatus(newStatus);
    }

    useEffect(() => {

        //debugger
   
        if (typeof isCancelled == "undefined") {
          return
        }
  
        if (typeof isStarted == "undefined") {
            return
        }
       
        if (typeof isEmpty == "undefined") {
            return
        }
       
        if(isStarted[0] === true && (isEmpty[0] === false && isCancelled[0] === false)){
            setStatus('Live')
        }
  
        if(isStarted[0] === false && isEmpty[0] === false  && isCancelled[0] === false){
            setStatus('Timed')
        }
    
        if(isEmpty[0] === true || isCancelled[0] === true){
            setStatus('Ended')
        }
    
        
    }, [isCancelled, isStarted, isEmpty, id])

    console.log(status, 'hhhhstatus')
    console.log(isStarted, 'isStarted')
    console.log(isEmpty, 'isEmpty')
    console.log(isCancelled, 'isCancelled')

    return (
        <div className="hidden md:block px-9 pb-9 bg-white dark:bg-dark-1 rounded-[20px]">
            <div className="w-full flex justify-center">
                <div className='w-1/2 py-5 flex justify-center items-center border-b-2 border-primary-green '>
                    <span className='font-bold text-primary-green'>
                        Admin Panel
                    </span>
                </div>
            </div>
             {/* <div className='mt-5'>
                {started ? 
                upcoming && status !== "Ended" && status !== "Live" ? <StartedNotLive whitelist_address={whitelist_address} showModal={showModal}/>
                :<Ended whitelist_address={whitelist_address} amount={amount} allocated={allocated} participants={participants} status={status} showModal={showModal}/>
                    :
                    Private ? 
                    <NotStartedPrivate airdrop={airdrop} whitelist_address={whitelist_address} showModal={showModal}/> 
                    : 
                    <NotStartedPublic showModal={showModal} />
                    }
                </div> */}
            <div className='mt-5'>
                {status === 'Ended' && <Ended whitelist_address={whitelist_address} amount={0} allocated={allocated} participants={participants} status={status} showModal={showModal}/>}
                {status === 'Live' && <Live whitelist_address={whitelist_address} amount={amount}  status={status} handleStatusChange={handleStatusChange}/>}
                {(status === 'Timed' && Private) && <NotStartedPrivate airdrop={airdrop} whitelist_address={whitelist_address} showModal={showModal}/>}
                {(status === 'Timed' && !Private) && <NotStartedPublic showModal={showModal}/>}
                </div>   
        </div>
    )
}

export default AdminPanel
 
