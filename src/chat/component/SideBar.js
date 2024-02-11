import React from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chates from './Chates'

const SideBar = () => {
  return (
    <div className='sidebar'>
        <Navbar />
        <Search />
        <Chates />
    </div>
  )
}

export default SideBar