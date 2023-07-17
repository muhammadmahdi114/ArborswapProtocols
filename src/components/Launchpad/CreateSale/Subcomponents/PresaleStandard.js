import React from 'react'
import Input from './Input';

export default function PresaleStandard({unsoldToken, setUnsoldTokens, setLockup}) {
    console.log("unsoldToken", unsoldToken)
    return (
        <div className="flex items-center gap-5 mt-10">
            <div className="w-1/2">
                <Input heading={'Unsold tokens'} icon1={"/images/arrows/arrow-down.svg"} icon2={"/images/arrows/arrow-up.svg"} changeState={setUnsoldTokens} value={unsoldToken} disabled={true} />
            </div>
            <div className="w-1/2">
                <div className='hidden md:block'>
                    <Input heading={'Liquidity Lockup (days)'} changeState={setLockup} nothing />
                </div>
                <div className='md:hidden'>
                    <Input heading={'Lockup (days)'} changeState={setLockup} nothing />
                </div>
            </div>
        </div>
    )
}
