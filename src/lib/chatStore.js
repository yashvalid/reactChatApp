import {create} from 'zustand'
import {doc, getDoc} from 'firebase/firestore'
import { db } from './firebase';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
    chatId: null,
    user : null,
    isCurrUserBlocked : false,
    isReceiverBlocked : false,
    
    changeChat : (chatId, user) =>{
        const CurrUser = useUserStore.getState().CurrUser

        if(user.blocked.includes(CurrUser.id)){
            return set({
                chatId,
                user : null,
                isCurrUserBlocked : true,
                isReceiverBlocked : false,
            })
        }
            
        else if(CurrUser.blocked.includes(user.id)){
            return set({
                chatId,
                user : user,
                isCurrUserBlocked : false,
                isReceiverBlocked : true,
            })
        } else {
            return set({
                chatId : chatId,
                user : user,
                isCurrUserBlocked : false,
                isReceiverBlocked : false,
            })
        }
        
    },

    changeBlock : ()=>{
        set(state =>({...state, isReceiverBlocked : !state.isReceiverBlocked}))
    }
    
  }))

  