import React from 'react'
import './login.css'
import { useState } from 'react'
import { toast } from 'react-toastify';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import {setDoc, doc} from 'firebase/firestore'
import { auth, db } from '../../lib/firebase';

function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState({
        file : null,
        url : ""
    })

    function handleAvatar(e){
        if(e.target.files[0]){
            setAvatar({
                file : e.target.files[0],
                url : URL.createObjectURL(e.target.files[0])
            })
        }
    }

    async function handleLogin(e){
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const {email, password} = Object.fromEntries(formData);
        try{
          await signInWithEmailAndPassword(auth, email, password)
        } catch(error){
          console.log(error.message);
        }
        finally{
          setLoading(false);
        }
        toast.success("Done")
    }

    async function handleRegister(e){
      e.preventDefault();
      const formData = new FormData(e.target);
      const {username, email, password} = Object.fromEntries(formData);
      
      try{
        const res = await createUserWithEmailAndPassword(auth,email,password);
        await setDoc(doc(db, "users", res.user.uid), {
          username,
          email,
          id : res.user.uid,
          blocked : [],
        });

        await setDoc(doc(db, "userChats", res.user.uid), {
          chats : [],
        });
        toast.success("Account created successfully")

      } catch(err){
        console.log(err);
        toast.error(err.message);
      }
      
  }

  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome back! </h2>
        <form onSubmit={handleLogin}>
            <input type='text' placeholder='Email' value={email} onChange={(e) =>setEmail(e.target.value)} name='email'/>
            <input type='password' placeholder='Password' name='password' />
            <button disabled={loading}>{loading? 'Loading' : "Login"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>New user? Create an account </h2>
        <form onSubmit={handleRegister}>
            <label htmlFor='file'>
                <img src={avatar.url || "./avatar.png"} alt="" />
                Upload a image
            </label>
            
            <input type="file" id='file' onChange={handleAvatar}/>
            <input type='text' placeholder='Username' name='username'/>   
            <input type='text' placeholder='Email' name='email'/>
            <input type='password' placeholder='Password' name='password'/>
            <button disabled={loading}>{loading? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}       
       
export default Login       
       