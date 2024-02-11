import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { chatContext } from '../context/ChatContext';


const Message = ({message}) => {
  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({behavior:'smooth'});
  },[message]);
  const {currentUser} = useContext(AuthContext);
  const {state:data} = useContext(chatContext);

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
        <div className="messageInfo">
           <img src={message.senderId === currentUser.uid ? currentUser?.photoURL :data.user?.photoUrl} alt="" /> 
          <span>{new Date(message?.date.seconds * 1000).toLocaleTimeString() + '-'+ new Date(message?.date.seconds * 1000).toLocaleDateString()}</span>
        </div>
        <div className="messageContent">
        {message.text && <p>{message?.text}</p> }  
          {message.image && <img src={message.image} alt="msg" />}
        </div>
    </div>
  )
}

export default Message