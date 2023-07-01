import React from 'react'

const NlistItem = ({iconimg, title, subtitle, status, isActive}) => {

  return (
    <div className='flex items-center mb-[10px] bg-[#f2f2f2] dark:bg-dark-text ' >
        <img className='mx-[10px] w-7 h-7' src={iconimg} alt={title} />
        <span className='item-text-span dark:text-dark-1'>
            <div className='title-div'>{title}</div>
            <div>
                <span className='subtitle-span'>{subtitle}</span> 
                { status ? <span className='status-success' /> : <span className='status-pending' />} 
            </div>
        </span>
        {isActive ? <span className='item-tick'> 
            <img src="/images/headericons/union.png" alt="" />
        </span> : '' }
        
    </div>

  )
}

export default NlistItem