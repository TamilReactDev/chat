import React, { useContext } from 'react'
import Add from '../img/add.png'
import Cam from '../img/cam.png'
import More from '../img/more.png'
import Messages from './Messages'
import Input from './Input'

import {FaBars} from 'react-icons/fa6'
import { chatContext } from '../context/ChatContext'


const Chat = () => {
  
    const {state:chatPerson} = useContext(chatContext);

 

  
  return (
    <div className='chat'>
        <div className='chatInfo'>
            <span>{chatPerson.user.name}</span>
            <div className='chatIcons'>
                <img src={Add} alt="" />
                <img src={Cam} alt="" />
                <img src={More} alt="" />
            </div>
        </div>
        <Messages />
        <Input />
    </div>
  )
}

export default Chat