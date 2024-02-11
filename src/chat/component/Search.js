import React, { useContext, useState } from 'react'
import profile from '../img/addAvatar.png'
import { db } from '../firebase';
import { collection, query, where, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';
import { chatContext } from '../context/ChatContext';


const Search = () => {

  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const { currentUser } = useContext(AuthContext);


  const handleSearch = async () => {

    try {

      const q = query(collection(db, "users"), where("name", "==", userName));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });

    } catch (error) {
      setError(error)
    }

  }
  const handleDown = (e) => {
    if (e.code === 'Enter') {
      handleSearch();
    }
  }

  const handleChange = (e) => {
    setUserName(e.target.value);
    if (e.target.value === '') {
      setUser(null);
    }
  }

  const {dispatch} = useContext(chatContext);

  const handleChat =async () => {

    dispatch({type:'CHANGE_USER',payload:{name:user.name,photoUrl:user.photoUrl,uid:user.uid}});

    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.id + currentUser.uid;

    const chat = await getDoc(doc(db, "chat", combinedId));
   

    if(!chat.exists()){
        await setDoc(doc(db,'chat',combinedId),{message:[]});

      
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo.uid"]:user.uid,
          [combinedId + ".userInfo.name"]:user.name,
          [combinedId + ".userInfo.photoUrl"]:user.photoUrl,
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo.uid"]:currentUser.uid,
          [combinedId + ".userInfo.name"]:currentUser.displayName,
          [combinedId + ".userInfo.photoUrl"]:currentUser.photoURL,
          [combinedId + ".date"]: serverTimestamp(),
        });       
    }
    setUser(null);
    setUserName('');

  }

  

  return (
    <div className='search'>
      <div className='searchForm'>
        <input type="text" placeholder='Search here after Enter' value={userName} onKeyDown={handleDown} onChange={handleChange} />
      </div>
      {user && user.uid !== currentUser.uid  && <div className='userChat' onClick={handleChat}>
        <img src={user.photoUrl} alt="" />
        <div className='userChatInfo'>
          <span>{user.name}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search