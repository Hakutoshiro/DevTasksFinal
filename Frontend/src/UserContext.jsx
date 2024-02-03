import axios from "axios";
import  {createContext, useEffect ,useState} from "react";
export const UserContext = createContext();

export function UserContextProvider({children}){
    const [user,setUser]= useState(null);
    const [ready,setReady]= useState(false);  
    const [fetchAgain, setFetchAgain]= useState(true);  
    const getUser =async () =>{
        const {data}=await axios.get('/profile')
        if(data)
        {
            setUser(data);
            setReady(true);
        }
    }  
    useEffect(()=>{
        if(!user){
            getUser();
        }
    })
    
    
    return (
        <UserContext.Provider value={{user,setUser,ready,setReady,fetchAgain, setFetchAgain}}>
            {children}
        </UserContext.Provider>
    );
}
