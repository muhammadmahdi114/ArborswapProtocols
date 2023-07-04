import React, { useState } from 'react'
import NlistItem from './NlistItem'


const Ndropdown = ({updateMenuItem, itemData}) => {
  
  const selectItem = (index) =>{
    updateMenuItem(index)
  }

  return (

    <div className='item-wrap bg-white dark:bg-dark'>
        <div className='menu-items'>
            
            <span className='menu-title'>Switch Network</span>
            {itemData.map((item, index)=>{
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                return (<div key = {index} onClick={ () => selectItem(index)} ><NlistItem iconimg={item.iconimg} title={item.title} subtitle={item.subtitle} status={item.status} isActive={item.isActive} /></div>)
            })}
            
        </div>
    </div>

  )
}

export default React.memo( Ndropdown )