import react from 'react';
import { useState ,useEffect} from "react";
import './AdminChatRoomDashboard.css'
import DisplayChatRoomusers from './DisplayChatRoomsusers';
import person from '../users/users.json'
import { useNavigate } from 'react-router-dom';
import { IsAuthOk } from '../../utils/utils';

const AdminChatRoomDashboard = (props) => {
  const[roomUsers,setRoomUsers] = useState <any >([]);
const [username, setUsername] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const [showmodal,setModal] = useState(false);
const[muteTime,setMuteTime] = useState("0:00");
const [time, setTime] = useState<any>("");
const [owner,setOwner] = useState("");
const [open_rs,setOpenRs] = useState(false);
const[msg,setMsg] = useState("");
const [haspassword,setHasPassword] = useState(false);
const [ispublic,setisPublic] = useState(false);

const [updatepwd,setUpdatePwd] = useState(false);
const [deletepwd,setDeletePwd] = useState(false);
const [Roompassword,setRoompassword] = useState("");
const [isUpdating, setIsUpdating] = useState(false);
const [isroomPrivate, setIsRoomPrivate] = useState(false);

const navigate = useNavigate();

const [Updated, setisUpdated] = useState(false);
const [MembersAdmin,setMembersAdmin] = useState <any>([]);
const [members,setMembers] = useState<any>([]);
const HandleAddUserAdmin = () => {


};

async function AddAdmin (username:string)
{
  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
{
  const current = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/setAdmin/" + username + "/" + props.room.id;
console.log("Api Set Admin Link :  =>  " + text);


await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  console.log("The AddAdminResponse is => " + JSON.stringify(json))
// 
// setErrorMessage("HHAHAHAHA")
setErrorMessage(json.message)
if(json.statusCode == "404")
{
  setErrorMessage(json.message)
}
if(json.statusCode == "500")
{
  setErrorMessage("An error occured in the backend.");
}
if(IsAuthOk(json.statusCode) == 1)
window.location.reload();

  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
}
}

const HandleAddAdmin = (e ) => {
    e.preventDefault();
    console.log("adding this user to be admin ...." + username);
    if(username)
    {
      AddAdmin(username);
    }
    else
    setErrorMessage("Could not find this user ! Are you sure u spelled it correcly ? ");
}


async function UnsetAdmin (username:string)
{
  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
{
  const current = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/unsetAdmin/" + username + "/" + props.room.id;
console.log("unsetAdmin   Link :  =>  " + text);


await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  console.log("The unsetAdmin is => " + JSON.stringify(json))
// 
setErrorMessage("Admin Unset")
if(json.statusCode == "404")
{
  setErrorMessage(json.message)
}
if(json.statusCode == "500")
{
  setErrorMessage("An error occured in the backend.");
}
if(IsAuthOk(json.statusCode) == 1)
window.location.reload();

  return json;
})
.catch((error) => {
  console.log("An error occured unsetAdmin : " + error)
  return error;
})

// }
}
}
const HandleUnsetAdmin = (e ) => {
  e.preventDefault();
  console.log("Unseting this user  admin ...." + username);
    if(username)
    {
      UnsetAdmin(username);
    }
    else
    setErrorMessage("Could not find this user ! Are you sure u spelled it correcly ? ");
}
const HandleMute = (e) => {
    e.preventDefault();
    setModal(!showmodal)
}

// const FilteredUsers = person.filter(person => {
//     // Here A changer : person with friends from backend , 
//     //filter nickname not name 
//     return person.nickname.toLowerCase().includes(username.toLowerCase());
//   })
  useEffect(() => {
    setErrorMessage("");
  },[username])

  async function MuteUserFromRoom() 
  {
     let text = ("http://localhost:5000/player/muteMember/");
  console.log(" MNutemember Ednpoint " + text + " ROOM ID IS : " + props.room.id + " TIME IS : " +time + "login is : " + username)
  // var date = new Date(time);

  var hms = time   // your input string
var a = hms.split(':'); // split it at the colons

// minutes are worth 60 seconds. Hours are worth 60 minutes.
var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
var minutes = seconds/ 60;

console.log("seconds : " + seconds + " minutes :  " + minutes);
// var hours = time.split(":")[0];
//   var minutes = time.split(":")[1];

//   var MinutesFromHours = Math.floor(hours  * 60);
//   var FormatedTime = Math.floor(MinutesFromHours + minutes);

// var FormatedTime  =( hours * 6 ) + minutes;
  // console.log("THE NUMBER OF MINUTES IS : " + hours +  ": " + minutes + " Formated : " + seconds)
  await fetch(text,{
    // mode:'no-cors',
    method:'post',
    credentials:"include",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
        { 
      room_id: props.room.id,
      time: minutes,
      login:username,
        }
      )
})

.then((response) => response.json())
.then(json => {
    console.log("The MutememberResponse   is => " + JSON.stringify(json))

    setErrorMessage(json.message);
    if(json.statusCode == "404")
    {
      setErrorMessage(json.message);
    }
    if(IsAuthOk(json.statusCode) == 1)
window.location.reload();
  // window.location.reload();
    return json;
})
.catch((error) => {
    console.log("An error occured : " + error)
    return error;
})


// }
  }


  const HandleMuteRequest = (e) => {
    e.preventDefault();
    console.log( username + " Will be  muted for : " + time);
    if(username)
    { 

      if(time)
      {
        MuteUserFromRoom();
      }
      else
      {
      setErrorMessage("Please enter a valid time duration for the mute.")

      }

    } 
    else
    {
      setErrorMessage("Please enter a valid username.")
    }
    // setErrorMessage("An error occured !");

  }
  const HandleRoomSettings = (e) => {
    e.preventDefault();
    setOpenRs(!open_rs)

  }
  async function BanUserFromRoom()
  {
    const loggeduser = localStorage.getItem("user");
  if(loggeduser)
{
  const current = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/banMember/" + username + "/" + props.room.id;
console.log("Api Fetch Link :  =>  " + text);


await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  console.log("The response is => " + JSON.stringify(json))
// 
if(json.statusCode =="404")
{
  setErrorMessage(json.message)
}
if(json.statusCode == "500")
{
  setErrorMessage("An error occured in the backend.");
}

if(IsAuthOk(json.statusCode) == 1)
window.location.reload();
  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
}
  }
  const HandleBanUser = (e) => {
    e.preventDefault();
    console.log( username + " Will be  banned ! ");
    if(username)
    {
      BanUserFromRoom();
    }
    else
    {
      setErrorMessage("Please enter a valid username.")
    }
  }
  const HandleRoomPublic = (e) => {
    e.preventDefault();
    setisPublic(true);
    setHasPassword(false);
    // setRoomPublic(!isRoomPublic);
    // setRoomPrivate(false);
} 
const HandleRoomPrivate = (e) => {
  e.preventDefault();

    // setRoomPrivate(!isRoomPrivate);
    // setRoomPublic(false);
    setisPublic(false);
    setHasPassword(true);

} 
async function KickUserFromRoom() 
{
  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
{
  const current = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/kickMember/" + username + "/" + props.room.id;
console.log("kickUserFromRoom Link :  =>  " + text);


await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  console.log( " KickUser Response is :  " + JSON.stringify(json))
// 
setErrorMessage(json.message)
if(json.statusCode =="404")
{
  setErrorMessage(json.message)
}
if(json.statusCode == "500")
{
  setErrorMessage("An error occured in the backend.");
}
if(IsAuthOk(json.statusCode) == 1)
window.location.reload();
  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
}
}

const HandleKickUser = (e) => {
  e.preventDefault();

  console.log("Kicking this user ! " + username);
  if(username)
  {
    KickUserFromRoom();
  }
  else
  {
    setErrorMessage("Please enter a valid username.")
  }

};

async function UnmuteUserFromRoom()
{
  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
{
  const current = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/unmuteMember/" + username + "/" + props.room.id;
console.log("kickUserFromRoom Link :  =>  " + text);


await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  console.log( " UnmuteUser Response is :  " + JSON.stringify(json))
// 
setErrorMessage(json.message)
if(json.statusCode =="404")
{
  setErrorMessage(json.message)
}
if(json.statusCode == "500")
{
  setErrorMessage("An error occured in the backend.");
}
if(IsAuthOk(json.statusCode) == 1)
window.location.reload();

  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
}
}

const HandleDeletePassword = (e) => {
e.preventDefault();
setDeletePwd(true);
setUpdatePwd(false);
}

const HandleUpdatePassword = (e) => {
  e.preventDefault();

  setDeletePwd(false);
setUpdatePwd(true);
}
const HandleUnmute = (e) => {
  e.preventDefault();
  if(username)
  {
    UnmuteUserFromRoom();
  }
  else
  {
    setErrorMessage("Please enter a valid username.")
  }
}

async function HandleSetPassword()
{
  
  let text = ("http://localhost:5000/player/SetPwdToPublicChatRoom/");
  console.log(" SetPassword Ednpoint " + text + " ROOM ID IS : " + props.room.id)
  await fetch(text,{
    // mode:'no-cors',
    method:'post',
    credentials:"include",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
        { 
      room_id: props.room.id,
      pwd: Roompassword,
        }
      )
})

.then((response) => response.json())
.then(json => {
    console.log("The SetPasswordResponse   is => " + JSON.stringify(json))

    if(IsAuthOk(json.statusCode) == 1)
    window.location.reload();

    if(json.statusCode == "404")
    setErrorMessage(json.message)
    else
    {
      navigate('/Landing');

    }


  // window.location.reload();
    return json;
})
.catch((error) => {
    console.log("An error occured : " + error)
    return error;
})

  }

  async function HandleDeletePwd()
{
  
  let text = ("http://localhost:5000/player/DeletePwdProtectedChatRoom/");
  console.log(" DELETEPWD Ednpoint " + text + " ROOM ID IS : " + props.room.id)
  await fetch(text,{
    // mode:'no-cors',
    method:'post',
    credentials:"include",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
        { 
      room_id: props.room.id,
      // pwd: Roompassword,
        }
      )
})

.then((response) => response.json())
.then(json => {
    console.log("The DELETEPWD RESP    is => " + JSON.stringify(json))

    if(IsAuthOk(json.statusCode) == 1)
    window.location.reload();

    if(json.statusCode == "404")
    setErrorMessage(json.message)
    else
    {
  window.location.reload();

    }
    

    return json;
})
.catch((error) => {
    console.log("An error occured : " + error)
    return error;
})

  }

  async function HandleUpadtePwd()
  {
    
    let text = ("http://localhost:5000/player/UpdatePwdProtectedChatRoom/");
    console.log(" UPDATEPWD Ednpoint " + text + " ROOM ID IS : " + props.room.id)
    await fetch(text,{
      // mode:'no-cors',
      method:'post',
      credentials:"include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
          { 
        room_id: props.room.id,
        new_password: Roompassword,
          }
        )
  })
  
  .then((response) => response.json())
  .then(json => {
      console.log("The UPDATEPWD RESP    is => " + JSON.stringify(json))
  
      if(IsAuthOk(json.statusCode) == 1)
      window.location.reload();
      
      if(json.statusCode == "404")
      setErrorMessage(json.message)
      else
      {
    window.location.reload();
  
      }

    // window.location.reload();
      return json;
  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })
  
    }
  useEffect(() => {
    
    const loggedUser  =localStorage.getItem("user");
    if(loggedUser)
    {
      const current = JSON.parse(loggedUser);
       const {id} = current;
      console.log("THE ID USEEFFECT IS " + id + "  ROOM  PRV " + props.room.is_private + "PROPS =>   : " , props);
      if(props.room.is_private)
      {
        console.log("THIS IS A PRIVATE ROOM")
        setIsRoomPrivate(true);
      }

      setMembersAdmin(props.room.all_members);
    const getMembers = localStorage.getItem("members");
      if(getMembers)
      {
        const ParsedMembers = JSON.parse(getMembers);
        console.log("THE GET MEMBERS IS " + getMembers +  " PARSED : "  + ParsedMembers.nickname);

        // localStorage.setItem("members","");
      }
      // // === Check condition + data types then true 
      if(props.statusMember.data.statusMember == "owner")
      {
        console.log(" I AM OWNER ")
        setOwner("true");

      }
      
      if(props.room.is_protected) 
      {
        console.log("Room has a password ! should be protected");
        setMsg("Your room is protected with a password ");
        setisPublic(false);
        setHasPassword(true);
      }
      else
      {
        setisPublic(true);
        setHasPassword(false);
        setMsg("Your room has no  password ");


      }
    }
  },[])
  const UpdateRoomPassword = (e) => {
    e.preventDefault();
    if(!Roompassword)
    {
      console.log("ERROR");
    setErrorMessage("Error ! No password inputed")    
  }
  else
  {
    
    console.log("Updating room passwond ..." +Roompassword) 
    setErrorMessage("")    
    HandleSetPassword();
    setTimeout(() => {
      setIsUpdating(false);
      setisUpdated(true);
      setTimeout(() => setisUpdated(false), 2500);
      // window.location.reload();
   
    }, 2000);
  }
  }

  const setNewRoomPassword = (e) => {
    e.preventDefault();

  {
    if(deletepwd)
    {
      console.log(" DELETE PWD FROM THIS CHATROOM");
      HandleDeletePwd();
    }
    else if (updatepwd)
    {
      if(Roompassword)

{
console.log(" UPADTING PWD  PWD FROM THIS CHATROOM");
  
console.log("Updating SETNEWROOM  passwond ..." +Roompassword) 
HandleUpadtePwd();
}     

else

{
  setErrorMessage(" Please enter a valid password.")
}

    }
    
    setTimeout(() => {
      setIsUpdating(false);
      setisUpdated(true);
      setTimeout(() => setisUpdated(false), 2500);
      // window.location.reload();
   
    }, 2000);
  }
  }
  // const FilteredUsers = MembersAdmin.filter(friends => {
  //   // Here A changer : person with friends from backend , 
  //   //filter nickname not name 
  //    return friends.player.nickname.toLowerCase().includes(username.toLowerCase());
  // })
    return (
        <div className='ChatRoomAdminDash-container'>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user in the chatroom"
          onChange={event => setUsername(event.target.value)}
       value={username || ""}
        />
        {errorMessage && <div className="error"> {errorMessage} </div>}

        {/* {username ? (
            <>
{FilteredUsers.map(c => < DisplayChatRoomusers key = {c} user = {c} />)}

            </>
        )  : (
            <>
            </>
        )} */}


      <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleBanUser}>
    <span className="icon material-symbols-outlined">
     {"Block"}  
      </span>
      <span> Ban User  </span>
      </button>

      <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleKickUser}>
    <span className="icon material-symbols-outlined">
     {"door_open"}  
      </span>
      <span> kick User  </span>
      </button>
      <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleMute}>
    <span className="icon material-symbols-outlined">
     {"Mic_Off"}  
      </span>
      <span> Mute   </span>
      </button>

      <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleUnmute}>
    <span className="icon material-symbols-outlined">
     {"campaign"}  
      </span>
      <span> Unmute   </span>
      </button>
      {showmodal ? (
        <>
        <input
         type="time" 
         id="mute"
          name="mute-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        //   onChange={HandleChange}
        //   onChange={event => setTime(event.target.value)};
        min="00:00" max ="18:00" >

        </input>
        <label htmlFor="mute"> Chose Mute Duration</label>
      
        <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleMuteRequest}>
    <span className="icon material-symbols-outlined">
     {"double_arrow"}  
      </span>
      </button>
        </>
      ) : (
        <>
        </>
      )}
      {owner === "true" ? (
<>
<button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleAddAdmin}>
    <span className="icon material-symbols-outlined">
     {"admin_panel_settings"}  
      </span>
      <span> Add As Admin  </span>
      </button>

      <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleUnsetAdmin}>
    <span className="icon material-symbols-outlined">
     {"mood_bad"}  
      </span>
      <span> Unset As Admin  </span>
      </button>
      {isroomPrivate ? (
        <>
        </>
      ) : (
        <>
  <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleRoomSettings}>
    <span className="icon material-symbols-outlined">
     {"Settings"}  
      </span>
      <span> Room Settings</span>
      </button>
        </>
      )}

      {open_rs ? (
        <>
   {/* <input type="text"
       className="form-control" 
       placeholder="Room Name " 
       onChange={event => setRoomName(event.target.value)}
       value={RoomName || ""}
       /> */}
       {props.room.is_protected ? (
        <>
              <h3>Channel Type : </h3>
       <span>{msg}</span>
         <input type="radio"
        value ="Public"
       placeholder="Room Name " 
       checked = {deletepwd}
       onChange={HandleDeletePassword}
       />
       Delete Password 
       <input type="radio"
        value ="Password"
       placeholder="Room Name " 
       checked = {updatepwd}
       onChange={HandleUpdatePassword}
       />
       Update  Password
       {updatepwd ? (
          <>
            <input type="password"
       className={`${Roompassword ? "has-value" : ""}`}
	   id="password"
       onChange={event => setRoompassword(event.target.value)}
       value={Roompassword || ""}
       />

        </>
        ) : (
          <>
          </>
        )}
        <button
      onClick={setNewRoomPassword}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : ""}
      </span>
    </button>
    {errorMessage && <div className="error"> {errorMessage} </div>}

        </>
       ) : (
        <>
        <h3>Channel Type : </h3>
       <span>{msg}</span>
         <input type="radio"
        value ="Public"
       placeholder="Room Name " 
       checked = {ispublic}
       onChange={HandleRoomPublic}
       />
       Public 
       <input type="radio"
        value ="Password"
       placeholder="Room Name " 
       checked = {haspassword}
       onChange={HandleRoomPrivate}
       />
       Set a Password
       {haspassword ? (
          <>
            <input type="password"
       className={`${Roompassword ? "has-value" : ""}`}
	   id="password"
       onChange={event => setRoompassword(event.target.value)}
       value={Roompassword || ""}
       />

<button
      onClick={UpdateRoomPassword}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : ""}
      </span>
    </button>
    {errorMessage && <div className="error"> {errorMessage} </div>}

          </>
        ) : (
          <>
          </>
        )}
        </>
        
       )}
     


    
   
        </>

        
      ) : (
        <>
        </>
      )}
</>
      ) : (
<>
</>
      )}

       
        </div>

    );
};

export default AdminChatRoomDashboard;