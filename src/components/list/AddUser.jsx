import React, { useState } from 'react';
import './addUser.css';
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';

function AddUser() {
  const [user, setUser] = useState(null);
  const { CurrUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');

    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        console.error('User not found.');
        setUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userChats");
  
    try {
      if (!user || !CurrUser) {
        console.error("User or current user is not defined.");
        return;
      }
  
      // Create a new chat document
      const newChatRef = doc(chatRef);
  
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
  
      // Prepare chat object without serverTimestamp()
      const chatForRecipient = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: CurrUser.id,
        updatedAt: Date.now(), // Use client-side timestamp here
      };
  
      const chatForCurrentUser = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: user.id,
        updatedAt: Date.now(), // Use client-side timestamp here
      };
  
      // Update the recipient's userChats document
      const recipientDocRef = doc(userChatsRef, user.id);
      await updateDoc(recipientDocRef, {
        chats: arrayUnion(chatForRecipient),
      }).catch(async (err) => {
        if (err.code === "not-found") {
          // If document doesn't exist, create it
          await setDoc(recipientDocRef, {
            chats: [chatForRecipient],
          });
        } else {
          throw err; // Re-throw other errors
        }
      });
  
      // Update the current user's userChats document
      const currentUserDocRef = doc(userChatsRef, CurrUser.id);
      await updateDoc(currentUserDocRef, {
        chats: arrayUnion(chatForCurrentUser),
      }).catch(async (err) => {
        if (err.code === "not-found") {
          // If document doesn't exist, create it
          await setDoc(currentUserDocRef, {
            chats: [chatForCurrentUser],
          });
        } else {
          throw err; // Re-throw other errors
        }
      });
  
      console.log("Chat successfully created!");
    } catch (err) {
      console.error("Error creating chat:", err.message);
    }
  };
  

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src="./avatar.png" alt="Avatar" />
            <span>{user.username || 'Unknown User'}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
