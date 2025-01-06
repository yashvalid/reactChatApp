import './userInfo.css'
import { useUserStore } from '../../lib/userStore';


function UserInfo() {

  const {CurrUser} = useUserStore();
    return (
      <div className="userInfo">
        <div className="user">
          <img src="./avatar.png" />
          <h2 >{CurrUser.username}</h2>
        </div>
        <div className="icons">
          <img src="./more.png" alt="More" className="" />
          <img src="./video.png" alt="Video" className="" />
          <img src="./edit.png" alt="Edit" className="" />
        </div>
      </div>
    );
  }
  
  export default UserInfo;
  