import axios from "axios"
import { UserContext } from "../UserContext";
import { useContext, useState } from "react";
import EditModal from "./EditModal";


export default function TaskItem({ task, tasks, setTasks }) {


    const { fetchAgain, setFetchAgain } = useContext(UserContext)

    const handleDoneBtn = async (task) => {
        await axios.post('/taskdone', {
            task: task
        })
        setTasks([])
        setFetchAgain(!fetchAgain);
    }

    const handleDeleteBtn = async (task) => {
        await axios.post('/taskdelete', {
            task: task
        })
        setFetchAgain(!fetchAgain);
    }

    const checkDate = (date) => {
        let date1 = new Date(date);
        let date2 = new Date();
        return date1<date2 ;
    }

    return <div className=" w-80 h-80 bg-gray-100 text-black rounded-xl shadow-2xl hover:scale-105 transition ease-in-out duration-650">
        <p className="text-3xl px-2 flex items-center min-h-16 border border-b-1 border-t-0 border-l-0 border-r-0 border-gray-400 ">{task.title}</p>
        <div className="flex flex-col px-2 pt-1 justify-between min-h-52 border border-b-1 border-t-0 border-l-0 border-r-0 border-gray-400 ">
            <p className="text-wrap">{task.description}</p>
            <br />
            <p className="text-lg">Due Date:{checkDate(task.date) &&(<div className="text-red-500">Overdue {task.date}</div>)}{!checkDate(task.date) && task.date}</p>
        </div>
        <div className={"flex gap-2 px-2 text-white "}>
            <button className="bg-green-500 px-4 rounded-lg my-2 py-1 basis-1/3 " onClick={() => handleDoneBtn(task)}>{task.status ? "Undo" : "Done"}</button>
            {
                !task.status && (

                    <EditModal key={task} task={task} tasks={tasks} setTasks={setTasks}/>


                )
            }
            <button className="bg-red-500 px-4 rounded-lg my-2 py-1 basis-1/3" onClick={() => handleDeleteBtn(task)}>Delete</button>

        </div>

    </div>
}