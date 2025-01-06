import { useState } from 'react'
import './App.css'
import List from './components/list/List'
import Chat from './components/chat/Chat'
import Detail from './components/detail/Detail'
import Login from './components/login/Login'
import Notification from './components/Notification'
import { useEffect } from 'react'
import {onAuthStateChanged} from 'firebase/auth'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
import { useChatStore } from './lib/chatStore'

function App() {
  const [count, setCount] = useState(0);
  const {CurrUser, isLoading, fetchUser} = useUserStore();
  const {chatId} = useChatStore();
  
  const user = false;

  useEffect(()=>{
    const sub = onAuthStateChanged(auth, (user) =>{
      fetchUser(user?.uid);
    })

    return () =>{
      sub();
    }
  },[fetchUser]);

  if(isLoading)
    return (
      <div className='loading'>Loading...</div>
    )

  return (
    <div className='container'>
      {CurrUser? 
      <>
        <List/>
        {chatId && <Chat/>}
        {chatId && <Detail/>}
      </> : 
      <Login/>
      }
      <Notification/>
    </div>
  )
}

export default App
