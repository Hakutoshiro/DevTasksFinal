import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default function RegisterPage(){
    const [name,setName] =useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    function registerUser(ev){
        ev.preventDefault();
        try {
            axios.post('/register',{
            name,
            email,
            password
            })
            alert('User created successfully.Now you can login.')     
        } catch (error) {
            alert('Error creating user');
        }
        
    }
    return (
        <div className="mt-4 grow flex   h-screen  justify-around items-center  ">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4 ">Register</h1>
                <form className="max-w-md mx-auto " onSubmit={registerUser}>
                    <input type="text" placeholder="Your Name" value={name} onChange={ev => setName(ev.target.value)}/>
                    <input type="email" placeholder="your@email.com" value={email} onChange={ev =>setEmail(ev.target.value)}/>
                    <input type="password" placeholder="password" value={password} onChange={ev =>setPassword(ev.target.value)}/>
                    <button className="primary" >Register</button>
                </form>
                <div className="text-gray-500 py-2">
                    Already a member? <Link to={'/login'} className="underline text-black font-bold ">Login</Link>
                </div>
            </div>
        </div>
    );
}