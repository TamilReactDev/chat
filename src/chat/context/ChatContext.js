import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";



export const chatContext = createContext();

 const initialState = {
    chatId:null,
    user:{}
  }    
  


export const ChatContextProvider = ({children}) => {
    const {currentUser} = useContext(AuthContext);
   
    const chatReducer = (state,action) => {

        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    user:action.payload,
                    chatId:currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid
                }
            default:
                return state
               
        }
    }

    const [state,dispatch] = useReducer(chatReducer,initialState);
   
   

    return (
        <chatContext.Provider value={{ state,dispatch }}>
            {children}
        </chatContext.Provider>
    )


}