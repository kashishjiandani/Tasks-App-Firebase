import React,{useState,useEffect} from 'react'
import {auth,provider} from './firebase'
import { signInWithPopup } from 'firebase/auth'
import Homepage from './Homepage';
import "./Login.css";

function Login() {

    const [value, setValue] = useState('')

    const handleClick = ()=>{
        signInWithPopup(auth,provider).then((data)=>{
            setValue(data.user.uid)
            localStorage.setItem("userId",data.user.uid)
            // console.log(data)
        })
    }


     useEffect(() => {
      setValue(localStorage.getItem('userId'))
     }, [])
     
    

  return (
    <>
    <div class="main-div">
      {value? <Homepage/>:
        <div class="profile__edit1" onClick={handleClick}><button class="profile__button1" >Sign-In With Google</button></div>
        // <button onClick={handleClick}>Sign-In With Google</button>
        }
    </div>
  </>
  )
}

export default Login
  