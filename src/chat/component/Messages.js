import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { doc, onSnapshot } from 'firebase/firestore';
import { chatContext } from '../context/ChatContext';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Messages = () => {

  const [messages,setMessage] = useState([]);
  const {state:data} = useContext(chatContext);
 

  

  useEffect(() => {

   function getChat(){
    
    const unsub = onSnapshot(doc(db, "chat",data.chatId), (doc) => {
      doc.exists() && setMessage(doc.data().message);
     });
 
     return () => unsub();
   }

   data.chatId && getChat();

  },[data.chatId]);

 

  return (
    <div className='messages'>
        {
          messages.map((message) => {
             return <Message key={message.id} message={message} />
          })
        }
    </div>
  )
}

export default Messages