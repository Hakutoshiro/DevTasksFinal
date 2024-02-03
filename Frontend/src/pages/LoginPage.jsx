
import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";



export default function LoginPage(){
    const {setUser,setReady} = useContext(UserContext)
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [redirect, setRedirect]= useState(false);
    async function handleLoginSubmit(ev)
    {
        ev.preventDefault();
        try {
            const {data} =await axios.post('/login',{email, password})
            alert('Login successful')
            setUser(data)
            setReady(true);
            setRedirect(true);
        } catch (error) {
            alert('Login failed.')
        }
    }
    if(redirect)
    {
        return (
            <Navigate to={'/'}/>
        )
    }
    return (
        <div className="mt-4 grow flex   h-screen  justify-around items-center  ">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4 ">Login</h1>
                <form className="max-w-md mx-auto " onSubmit={handleLoginSubmit}>
                    <input type="email" placeholder="your@email.com" value={email} onChange={(ev)=>{setEmail(ev.target.value)}}/>
                    <input type="password" placeholder="password" value={password} onChange={(ev)=>{setPassword(ev.target.value)}}/>
                    <button className="primary">Login</button>
                </form>
                <div className="text-gray-500 py-2">
                    Don't have an account yet? <Link to={'/register'} className="underline text-black font-bold ">Register Now</Link>
                </div>
            </div>
        </div>
    );
}