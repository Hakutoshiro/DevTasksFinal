import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";


export default function Header(){
    const {user} = useContext(UserContext);
    return (
        <header className="flex justify-between">
                <Link to={'/'} className="flex items-center  gap-1  ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>
                    <span className="font-bold text-xl py-2">DevTasks</span>
                </Link>
                
                <Link to={user?'/account':'/login'} className="flex items-center gap-2  border border-gray-300 rounded-full py-2 px-4 mt-2">
                    <div className=" bg-gray-500 text-white rounded-full overflow-hidden border border-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {user && (
                        <div>
                            {user.name}
                        </div>
                    )}
                </Link>
            </header>
    )
}