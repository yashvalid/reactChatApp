import React from 'react'
import { useState } from 'react'
import './chatList.css'
import AddUser from './AddUser';
import { useUserStore } from '../../lib/userStore';
import { useEffect } from 'react';
import {onSnapshot, doc, getDoc, updateDoc} from 'firebase/firestore'
import { db } from '../../lib/firebase';
import {useChatStore} from '../../lib/chatStore'

function ChatList() {
    const [Addmode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const {CurrUser} = useUserStore();
    const {changeChat} = useChatStore();

    useEffect(() => {
      const unSub = onSnapshot(
        doc(db, "userChats", CurrUser.id),
        async (res) => {
          const items = res.data().chats;
    
          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
    
            const user = userDocSnap.data();
    
            return { ...item, user };
          });
    
          const chatData = await Promise.all(promises);
    
          console.log("Chat Data:", chatData); // Debug log to check the data structure
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      );
    
      return () => {
        unSub();
      };
    }, [CurrUser.id]);

    async function handleChat(chat){

      const userChats = chats.map((item) => {
        const { user, ...rest } = item;
        return rest;
      });
  
      const chatIndex = userChats.findIndex(
        (item) => item.chatId === chat.chatId
      );
  
      userChats[chatIndex].isSeen = true;
  
      const userChatsRef = doc(db, "userChats", CurrUser.id);
  
      try {
        await updateDoc(userChatsRef, {
          chats: userChats,
        });
        changeChat(chat.chatId, chat.user);
      } catch (err) {
        console.log(err);
      }

    }
    

  return (
    <div className='chatList'>
      <div className='search'>
        <div className="searchBar">
            <img src='./search.png' />
            <input type='text' placeholder='search'/>  
        </div>
        <img src={Addmode ? './minus.png' : './plus.png' } onClick={() => Addmode ? setAddMode(false) : setAddMode(true)} className='add'/>
      </div>
      
        {chats? chats.map((chat)=>(
          <div className="item" key={chat.chatId} onClick={()=>handleChat(chat)} style={{backgroundColor : chat.isSeen? 'transparent' : "#5183fe"}}>
            <img src="./avatar.png" alt="" />
            <div className="texts">
                <span>{chat.user.username}</span>
                <p>{chat.lastMessage}</p>
            </div>
          </div> 
        )) : <div>NO chats yet</div>}
        
      {Addmode? <AddUser/> : null}
      
    </div>
  )
}

export default ChatList
