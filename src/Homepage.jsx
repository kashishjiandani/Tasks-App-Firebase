import React, { useState,useEffect } from "react";
import "./Homepage.css";
import { db } from "./firebase"
import { uid } from "uid";
import {set,ref, onValue , remove,update} from "firebase/database"
import Avatar from "@mui/material/Avatar";
import { storage } from "./firebase";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as sRef,listAll } from 'firebase/storage'


function Homepage() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // CREATE TASK
  const [task, setTask] = useState("")
  const [userId, setUserId] = useState(localStorage.getItem('userId'))

  const addTask = (e) => {
    e.preventDefault();
    const taskId = uid();
    set(ref(db, `/${userId}/${taskId}`),{
      task:task,
      taskId:taskId,
    });
    setTask("")
  };

  // READ TASK
  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    onValue(ref(db,  `/${userId}`),(snapshot)=>{
      setTaskList([]);
      const data = snapshot.val();
      if(data!==null){
        Object.values(data).map((task)=>{
          console.log(data)
          setTaskList((oldArray) => [...oldArray,task]);
        });
      }
    });
  }, [])

  // DELETE TASK
  const handleDelete = (task)=>{
    remove(ref(db,`/${userId}/${task.taskId}`));
    setTaskList(taskList.filter((todo) => todo !== task));
  };

  //UPDATE TASK
  const [editing, setEditing] = useState(false);
  const [tempTaskId, setTempTaskId] = useState("");

  const handleUpdate =(task)=>{
    setEditing(true);
    setTempTaskId(task.taskId)
    //  console.log(task.taskId)
    // setTask(task.task)
    //  console.log(task.task)
  };

  const handleSubmitChange =()=>{

    update(ref(db,`/${userId}/${tempTaskId}`), {
      task:task,
    });
console.log('zz')
    setEditing(false);
    setTask("");
  }

//ADD PROFILE PICTURE
const [image, setImage] = useState(null);
const [url, setUrl] = useState(null);

const handleImageChange = (e) => {
  if (e.target.files[0]) {
    setImage(e.target.files[0]);
  }
};

useEffect(() => {
   listAll(sRef(storage,`/${userId}`)).then(
    (response) => {
      console.log(response)
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          console.log(url)
          setUrl(url);
        });
      });
    }
  );
}, [])

const handleSubmit = () => {
  const imageRef = sRef(storage, `/${userId}/image`);
  uploadBytes(imageRef, image)
    .then(() => {
      getDownloadURL(imageRef)
        .then((url) => {
          setUrl(url);
        })
        .catch((error) => {
          console.log(error.message, "error getting the image url");
        });
      setImage(null);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

  
  return (
    <>
      <div class="main-div">
        <div class="inner-div">
         <div class="profile__picture">
         <Avatar src={url} sx={{ width: 150, height: 150 }} />
          </div>
         <div class="profile__edit">
          <input type="file" class="profile__button" onChange={handleImageChange} />
          <button className="profile__button" onClick={handleSubmit}>Upload</button>
          </div>
          <h2 className="task-header">My Tasks</h2>
          <form onSubmit={addTask}>
            <div className="addtask">
            <input
              type="text"
              placeholder="Enter Your Task"
              className="task-input"
              value={task}
              required
              onChange={(e) => setTask(e.target.value)}
            />
            {editing?(
          <>
          <button className="btn btn-info text-white btns" onClick={()=>handleSubmitChange()}>Done</button>
          <button className="btn btn-info text-white btns"
            onClick={() => {
              setEditing(false) }}
          >X</button>
        </>):( <button className="btn btn-info text-white btns" type="submit">Add Task</button>)}
        </div>
            {taskList.map((task) =>(
              <>
          <div className="tasklist">
              <h1 className="task-item">{task.task}</h1>
              <button className="btn btn-success text-white btns" onClick={()=>handleUpdate(task)}>Update</button>
              <button className="btn btn-danger text-white btns" onClick={()=>handleDelete(task)}>Delete</button>
            </div> 
              </>
            ))}
          </form>
        </div>
      <div className="logout">
      <div class="profile__edit2" onClick={handleLogout}><a class="profile__button2" href="#">Log Out</a></div>
      </div>
      </div>
    </>
  );
}

export default Homepage;
