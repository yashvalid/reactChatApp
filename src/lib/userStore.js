import {create} from 'zustand'
import {doc, getDoc} from 'firebase/firestore'
import { db } from './firebase';

export const useUserStore = create((set) => ({
    CurrUser: null,
    isLoading : true,
    fetchUser : async (uid) =>{
        if(!uid) return set({CurrUser : null, isLoading : false});

        try{
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists)
                set({CurrUser : docSnap.data(), isLoading : false})
            else
                set({CurrUser : null, isLoading : false})

        } catch(error){
            set({CurrUser : null, isLoading : false});
        }
    }
    
  }))

  