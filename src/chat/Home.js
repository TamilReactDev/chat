import React, { Suspense } from 'react'
import SideBar from './component/SideBar'
import Chat from './component/Chat'
import { ChatContextProvider } from './context/ChatContext'

const Home = () => {
  return ( 
    <div className='home'>
        <div className='container-chat'>
            <ChatContextProvider>
              <SideBar />
              <Chat />
            </ChatContextProvider>
             
        </div>
    </div>
  )
}

export default Home