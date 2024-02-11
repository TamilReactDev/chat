import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { chatContext } from '../context/ChatContext';


const Chates = () => {

  const { currentUser } = useContext(AuthContext);

  const {dispatch} = useContext(chatContext);

  const [chat, setChat] = useState([]);

  useEffect(() => {

    function getChat() {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChat(doc.data());
      });

      return () => unsub();
    }

    currentUser.uid && getChat();

  }, [currentUser.uid]);

  const handleClick = (userinfo) => {

      dispatch({type:'CHANGE_USER',payload:userinfo});

  }

  
  return (
    <div className="chats">
      {
        chat &&
        Object.entries(chat)?.sort((a,b) => b[1].date - a[1].date).map((chat) => {
          return (
            <div key={chat[0]} className="userChat" onClick={() => handleClick(chat[1]['userInfo'])}>
              <img src={chat[1]['userInfo']['photoUrl']} alt="profileImage" />
              <div className="userChatInfo">
                <span>{chat[1]['userInfo']['name']}</span>
                <p>{chat[1]?.lastMessage?.text}</p>
              </div>
            </div>

          )
        })
      }


    </div>
  )
}

export default Chates