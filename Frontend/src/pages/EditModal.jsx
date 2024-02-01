import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function EditModal({task,tasks,setTasks}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const {fetchAgain, setFetchAgain} = useContext(UserContext)

    useEffect(()=>{
        setTitle(task.title)
        setDescription(task.description)
        setDate(task.date)
    },[])

    const handleUpdate = async (ev)=>{
        ev.preventDefault();
        try {
            const response= await axios.post('/updatetask',{
                task:task,
                title:title,
                description:description,
                date:date,
            })
        } catch (error) {
            alert('Updation Failed')
        }
            setTasks([])
            setFetchAgain(!fetchAgain)
    }

    return (
        <div>
            <button className="bg-blue-500 px-4 rounded-lg my-2 py-1 basis-1/3" onClick={onOpenModal}>Edit</button>
            <Modal open={open} onClose={onCloseModal} center>
                <div>
                    <form className="" onSubmit={(ev)=>handleUpdate(ev)}>
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" value={title} onChange={ev => setTitle(ev.target.value)} />
                        <label htmlFor="description">Description</label>
                        <textarea name="description" cols="30" rows="3" value={description} onChange={ev => setDescription(ev.target.value)} ></textarea>
                        <div>
                            <label htmlFor="dueDate">Due Date and Time</label>
                            <br />
                            <input type="date" name="dueDate" value={date} onChange={ev => setDate(ev.target.value)} />
                        </div>
                        <button className="primary mb-8" >Update</button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

