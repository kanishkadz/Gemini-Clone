import React from 'react'
import './SideBar.css'
import { assets } from '../../assets/assets'

const SideBar = () => {
  return (
    <div className='sidebar'>
        <div className="top">
            <img src={assets.menu_icon} alt="" />
        </div>
        <div className="bottom">

        </div>
    </div>
  )
}

export default SideBar