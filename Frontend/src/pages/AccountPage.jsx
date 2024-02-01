import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate ,Link, useParams} from "react-router-dom"
import axios from "axios"

export default function AccountPage(){
    const {user,ready,setUser} = useContext(UserContext)
    const[redirect,setRedirect] = useState(false)
    if(redirect) {
        return <Navigate to={'/'}/>
    }
    let {subpages}= useParams();
    if(subpages===undefined)subpages='profile';

    if(!ready){
        return 'Loading..'
    }
    if(ready && !user && !redirect) {
        return <Navigate to={'/login'}/>;
    }
    async function logout(){
        await axios.post('/logout')
        setRedirect(true);
        setUser(null);
    }

    return (
        <>
            <nav className="py-10 flex gap-20 max-w-4xl mx-auto ">
                <Link to={'/account'} className='inline-flex gap-1 py-2 px-4 rounded-full bg-primary   text-white' element={<AccountPage/>}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                    My Profile
                </Link>
            </nav> 
                <div className="text-center max-w-lg mx-auto">
                <br />
                <div className="flex flex-col w-80">
                <p className="flex justify-between">
                    Name: <span>{user.name} </span>
                </p> 
                <p className="flex justify-between">
                    Email:<span>{user.email}</span>
                </p>
                </div>
                <button onClick={logout}  className="bg-primary text-white w-full mx-auto rounded-xl px-4 mt-4 py-1">Logout</button>
            </div>
        </>
    )
}