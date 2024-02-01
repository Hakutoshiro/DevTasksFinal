import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

import TaskItem from "./TaskItem"

export default function IndexPage() {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const { user, fetchAgain } = useContext(UserContext)
    const [Tasks, setTasks] = useState([])
    
    const handleAddTask = () => {
        setShowForm(!showForm);
    }

    useEffect(() => {
        getTasks()
    }, [user, fetchAgain])

    const handleSubmitBtn = async () => {
        let date1 = new Date(date);
        let date2 = new Date();
        if (!title || !date) {
            alert('Please enter Title and Due Date');
        
            return;
        }
        else if(date1<date2){
            alert('Please enter a valid date');
            return;
        
        } else {
            const userDoc = await axios.post('/addtask', {
                userId : user._id,
                title: title,
                description: description,
                date: date,
            })
            console.log(userDoc);
            setTitle('');
            setDescription('');
            setDate('');
            setShowForm(false);
            getTasks();
        }
    }
    const getTasks = async () => {
        
            const { data } = await axios.get('/dataretreival')
            const tmp = data;
            setTasks(tmp);
        
    }

    return (
        <>
            {user && (<>
            
            <nav className="py-4 flex justify-between gap-14 max-w-4xl ">
                <p className="text-3xl">Task</p>
                <button onClick={handleAddTask} className="inline-flex bg-primary py-1 px-4 rounded-2xl text-white text-xl gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 pt-1">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
                    Add Task
                </button>
            </nav>
            {showForm && (
                <div>
                    <form className="" >
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" value={title} onChange={ev => setTitle(ev.target.value)} maxLength={20} />
                        <label htmlFor="description">Description</label>
                        <textarea name="description" cols="30" rows="3" value={description} onChange={ev => setDescription(ev.target.value)}
                        className=" resize-none" maxLength={220} ></textarea>
                        <div>
                            <label htmlFor="dueDate">Due Date and Time</label>
                            <br />
                            <input type="date" name="dueDate" value={date} onChange={ev => setDate(ev.target.value)} />
                        </div>
                    </form>
                    <button className="primary mb-8" onClick={handleSubmitBtn}>Submit</button>
                </div>
            )}

            <div className="flex flex-wrap flex-col border border-black items-center max-w-3xl rounded-3xl pb-4" >
                <h1 className="text-5xl py-2">To Do</h1>
                <div className="flex gap-9 flex-wrap justify-center ">
                    {
                        Tasks?.map((task,index) => {
                            if(!task.status)
                            return <TaskItem key={{task,index}} task={task} tasks={Tasks} setTasks={setTasks}/>;
                        })
                    }
                </div>
            </div>
            <div className="flex flex-wrap mt-8 border border-black flex-col items-center rounded-3xl pb-4" >
            <h1 className="text-5xl py-2">Done</h1>
                <div className="flex gap-9 flex-wrap justify-center ">
                    {
                        Tasks?.map((task,index) => {
                            if(task.status)
                            return <TaskItem key={{task,index}} task={task} tasks={Tasks} setTasks={setTasks}/>;
                        })
                    }
                </div>
            </div>
            </>)}
        </>
    )
}