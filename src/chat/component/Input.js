import React, { useContext, useState } from 'react'
import Attach from '../img/attach.png'
import Img from '../img/img.png'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { chatContext } from '../context/ChatContext';
import { nanoid } from '@reduxjs/toolkit'
import { AuthContext } from '../context/AuthContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Spinner } from 'react-bootstrap';


const Input = () => {

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading,setLoading] = useState(false);

  const { state: data } = useContext(chatContext);
  const { currentUser } = useContext(AuthContext);


  const handleSend = async () => {

	if(!data.chatId){
		alert('please select receiver');
		return;
	}
	if(!text && !image){
		return;
	}

    try {
      setLoading(true);
      if (image) {
        const storageRef = ref(storage, nanoid());
        await uploadBytesResumable(storageRef, image).then(async () => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chat', data.chatId), {
              message: arrayUnion({
                id: nanoid(),
                text,
                senderId: currentUser.uid,
                image: downloadURL,
                date: Timestamp.now()
              })
            })
          })
        })


      } else {
        await updateDoc(doc(db, 'chat', data.chatId), {
          message: arrayUnion({
            id: nanoid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now()
          })
        })
      }
	  await updateDoc(doc(db, 'userChats', currentUser.uid), {
		[data.chatId + '.date']: serverTimestamp(),
		[data.chatId + '.lastMessage']: {
		  text
		}
	  })
	  await updateDoc(doc(db, 'userChats', data.user.uid), {
		[data.chatId + '.date']: serverTimestamp(),
		[data.chatId + '.lastMessage']: {
		  text
		}
	  });

	  setText('');
	  setImage(null);
	
    } catch (error) {
      alert(error);
    }finally{
      setLoading(false)
    }


  }



  return (
    <div className="input">
      <input type="text" placeholder="Type something..." value={text} onChange={(e) =>  setText(e.target.value)} />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{ display: "none" }} accept='image/jpeg,image/jpg' id="file" onChange={(e) => setImage(e.target.files[0])} />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>
          {loading ? 'loading' : 'send' } 
        </button>
      </div>
    </div>
  )
}

export default Input