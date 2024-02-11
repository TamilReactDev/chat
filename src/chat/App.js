import React, { useContext } from 'react'
import Register from './pages/Register'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import Home from './Home'
import Login from './pages/Login'
import { AuthContext } from './context/AuthContext'


const App = () => {

   
  const {currentUser} = useContext(AuthContext);



  const ProductedRoutes = ({children}) => {

   
   
    if(!currentUser){
        return <Navigate to='/login' />
    }

    return children

  }
  const AlreadyLogin = ({children})=> {

    if(currentUser){
      return  <Navigate to="/" />
    }

    return children

}


  return (
  
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<ProductedRoutes><Home /></ProductedRoutes>} />
          <Route path='register' element={<Register />} />
          <Route path='login' element={
          
          <AlreadyLogin>
               <Login />
          </AlreadyLogin>
         
          
          } />
        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App