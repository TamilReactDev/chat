import React, { useContext } from 'react'
import {IoClose} from 'react-icons/io5';
import { AuthContext } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {

  const {currentUser} = useContext(AuthContext)

  return (
    <div className='navbar'>
        <span className='logo'>Chat App</span>
        <div className='user'>
            <img src={currentUser?.photoURL} alt="" />
            <span>{currentUser?.displayName}</span>
            <button style={{ borderRadius:'5px' }} onClick={() => signOut(auth)}>Logout</button>
        </div>
    </div>
  )
}

export default Navbar

// LaMa#567 ,,, lamadiv@gamil.com