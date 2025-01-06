import React from 'react'
import ChatList from './ChatList'
import UserInfo from './UserInfo'
import './list.css'

function List() {
  return (
    <div className='list'>
      <UserInfo />
      <ChatList />
    </div>
  )
}

export default List
