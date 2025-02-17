import React from 'react'
import './detail.css'
import { auth } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'

function Detail() {
    const {user, isCurrUserBlocked, isReceiverBlocked, chatID} = useChatStore();
    const {CurrUser} = useUserStore();

    const handleBlock = async () => {
        if (!user) return;
    
        const userDocRef = doc(db, "users", CurrUser.id);
    
        try {
          await updateDoc(userDocRef, {
            blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
          });
          changeBlock();
        } catch (err) {
          console.log(err);
        }
      };

  return (
    <div className='detail'>
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>{user?.username}</h2>
        {/* <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam numquam nemo fugiat distinctio autem est repudiandae similique deleniti ab expedita voluptates tempore consequuntur, reprehenderit odit nulla quas possimus laboriosam sequi.</p> */}
      </div>
      <div className="info">
        <div className="option">
            <div className="title">
                <span>Setttings</span>
                <img src="./arrowUp.png" alt="" />
            </div>
        </div>
        <div className="option">
            <div className="title">
                <span>Privacy settings</span>
                <img src="./arrowUp.png" alt="" />
            </div>
        </div>
        <div className="option">
            <div className="title">
                <span>Shared Photos</span>
                <img src="./arrowDown.png" alt="" />
            </div>
            {/* <div className="photos">
                <div className="photoItem">
                    <div className='photoDetail'>
                        <img src="https://images.pexels.com/photos/7047135/pexels-photo-7047135.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        <span>photo_2018</span>
                    </div>
                    <img src="./download.png" alt="" className='icon'/>
                </div>
                <div className="photoItem">
                    <div className='photoDetail'>
                        <img src="https://images.pexels.com/photos/7047135/pexels-photo-7047135.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        <span>photo_2018</span>
                    </div>
                    <img src="./download.png" alt="" className='icon'/>
                </div>
                
            </div> */}
        </div>
        <div className="option">
            <div className="title">
                <span>Shred files</span>
                <img src="./arrowUp.png" alt="" />
            </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
       <button className='logout' onClick={()=> auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail
