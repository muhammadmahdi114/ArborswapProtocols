import React, { useState, useEffect } from 'react'
import Ndropdown from './Ndropdown'
import { Networkswitch } from 'data/networkswitch'
import { useEthers } from '@usedapp/core'
import { BSC, BSCTestnet} from '@usedapp/core'


const MenuButton = () => {
    const {chainId, switchNetwork, account, activate, activateBrowserWallet } = useEthers()
    
    const [toggle, setToggle] = useState(false)
    const [activeItem, setActiveItem] = useState({
        img: '/images/headericons/BinanceSmartChainBadge.svg',
        title: 'Binance Smart Chain'
    })


    const [itemData, setItemData] = useState([])

    useEffect(() => {
        const nSwitch = window.localStorage.getItem('network-switch')
        
        if( nSwitch ){
            const tm = JSON.parse(nSwitch)
            setItemData( tm )
            tm.forEach(elm => {
                if( elm.isActive ){
                    setActiveItem({
                        img: elm.iconimg,
                        title: elm.title
                    })
                }
            });
        }else{
            setItemData( Networkswitch )
        }

    }, []);
    
    const toggleNetworkDropdown = ()=>{
         
        if(toggle){
            setToggle(false)
        }else{
            setToggle(true)
        }
    }

    const updateMenuItem = async (index) =>{
        if (itemData[index].title === 'BSC Testnet'){
            await switchNetwork(BSCTestnet.chainId);
        }

        if (itemData[index].title === 'Binance Smart Chain'){
            await switchNetwork(BSC.chainId);
        }

        let temItem = [...itemData]
        temItem = temItem.map((item)=>{ 
            return {...item, isActive: false, status: false, subtitle: "Not Connected",  }
        })
        
        temItem[index].isActive = true;
        temItem[index].status = true;
        temItem[index].subtitle = "Connected";
    
        setItemData(temItem);

        setActiveItem({
            img: itemData[index].iconimg,
            title: itemData[index].title
        })
        
        setToggle(false)


        localStorage.setItem('network-switch', JSON.stringify(temItem) )
        window.dispatchEvent( new Event('storage') ) // <----- 

    }

  return (
        <div className='relative'>
            <div className='menu-items-div items-center dark:bg-dark-1 dark:text-white' onClick={toggleNetworkDropdown}>
                <div className='menu-item-left items-center'>
                    <span className='item-icon'>
                        <img width="26" src={activeItem.img} alt="" />
                    </span>
                    <span className='item-text'> {activeItem.title} </span>
                </div>
                <div className='flex p-1 rounded-xl bg-white justify-center items-center '>
                    <img style={ ! toggle ? {transform: "rotate(180deg)" } : {} } src="/images/headericons/arrow-up.svg" alt="" />
                </div>
            </div>
            {toggle ? <Ndropdown updateMenuItem={updateMenuItem} itemData={itemData} /> : ''}
        </div>
  )
}

export default MenuButton