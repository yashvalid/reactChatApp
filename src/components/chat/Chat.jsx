import React from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import {onSnapshot, doc, updateDoc, getDoc, arrayUnion} from 'firebase/firestore'
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import {useUserStore} from '../../lib/userStore'



function Chat() {
    const [emojiPicker , setEmojiPicker] = useState(false);
    const [message, setmessage] = useState('');
    const [chat, setChat] = useState();
    const endRef = useRef(null);
    const {chatId,user} = useChatStore();
    const [text, settext] = useState("");
    const {CurrUser} = useUserStore();
    const [img, setImg] = useState({
        file : null,
        url : "",
    });

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [chat?.messages]);

   useEffect(()=>{
    const unSub = onSnapshot(doc(db, "chats", chatId), (res)=>{
        setChat(res.data())
    })
    return () =>{
        unSub();
    }
   },[chatId])


    function handleEmoji(e){
        settext(prev => prev+e.emoji);
        setEmojiPicker(false);
    }

    const handleSend = async() =>{
        if(text === "") return;


        try{

            await updateDoc(doc(db, "chats", chatId), {
                messages : arrayUnion({
                    senderId : CurrUser.id,
                    text,
                    createdAt : new Date(),
                }),
            });

            const userIds = [CurrUser.id, user.id];

            userIds.forEach(async (id) =>{
                const userChatsRef = doc(db, "userChats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if(userChatsSnapshot.exists()){
                    const userChatsData = userChatsSnapshot.data();
                    const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === CurrUser.id? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats : userChatsData.chats
                    })

                }
            })
            settext("");
        } catch(err){
            console.log(err.message);
        }
        setImg({
            file : null,
            url : "",
        });
    }

    function handleImg(e){
        if(e.target.files[0]){
            setImg({
                file : e.target.files[0],
                url : URL.createObjectURL(e.target.files[0])
            })
        }
    }

  return (
    <div className='chat'>
        <div className="top">
            <div className="user">
                <img src="./avatar.png" alt="" />
                <div className="texts">
                    <span>{user.username}</span>
                    <p>Lorem ipsum dolor sit amet consectetur .</p>
                </div>
            </div>
            <div className="icons">
                <img src="./phone.png" alt="" />
                <img src="./video.png" alt="" />
                <img src="./info.png" alt="" />
            </div>
        </div>
        <div className="center">
            {chat?.messages?.map((message)=>(
                <div className={message.senderId === CurrUser.id? 'message own' : message} key={message.createdAt}>
                    <div className="texts">
                        {message.img && <img src={message.img} alt="" />}
                        <p>{message.text}</p>
                        <span>1 min ago</span>
                    </div>
                </div>
            ))
            
            }
            { img.url && <div className='message own'>
                <div className="texts">
                    <img src={img.url} />
                </div>
            </div>}
            
            <div ref={endRef}></div>
        </div>
        <div className="bottom">
            <div className="icons">
                <label htmlFor='file'>
                    <img src="./img.png" alt="" />
                </label>
                <input type='file' id='file' style={{display:'none'}} onChange={handleImg}/>
                <img src="./camera.png" alt="" />
                <img src="./mic.png" alt="" />
                <input type='text' placeholder='type a message' value={text} onChange={(e) => settext(e.target.value)}/>
                <div className="emoji" onClick={() => setEmojiPicker((prev) =>!prev)}>
                    <img src="./emoji.png" alt="" />
                    <div className="picker">
                        <EmojiPicker onEmojiClick={handleEmoji} open={emojiPicker}/> 
                    </div>
                </div>
                <button className='sendButton' onClick={handleSend}>send</button>
            </div>
        </div>
    </div>
  )
}

export default Chat
