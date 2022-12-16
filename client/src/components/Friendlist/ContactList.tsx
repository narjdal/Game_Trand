import React from "react";

import Contact from "./Contact";
import { useState ,useEffect} from "react";
import './ContactList.css'
import SearchBar from '../users/SearchBar'

import { io } from "socket.io-client";
import { Socket } from 'dgram';
// import socket
var socket:any;
const ContactList = (props) => 
{
    const [AddFriend,setAddFriend] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    // const [Dmcount,SetDmCount] = useState(0);

    const [ContactList,setContactList] = useState([]);
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [user42,SetUser42] = useState<any>([])
    const [contacts ,setContacts] = useState <any>([]);
    useEffect(() => {
        const loggeduser = localStorage.getItem("user");
    
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          console.log("=>>>>> FROM THE ContactList "   + Current_User.nickname + Current_User.id)
          SetUser42(Current_User);
          setContacts(props.contacts);
    // socket = io("http://localhost:5000");
    //       socket.on("onlineUsersFront", (data: any) => {
    //         console.log("OnLine e e e e e: ", data);
    //         localStorage.setItem("online",JSON.stringify(data))
      
    //       });
        }
    // localStorage.setItem("DmCount",Dmcount.toString());

    },[]);

//   const handleSearch = async () => {

//     // const q = query(
//     //   collection(db, "users"),
//     //   where("displayName", "==", username)
//     );
    async function handleSearch() {

    };
    const handleSelect = (e) => {
        // e.code == "select"
        // e.code === "Enter" && handleSearch();
        console.log("inside Handle Select ",localStorage.getItem("Dmcount"));
        // SetDmCount(Dmcount + 1);
        // localStorage.setItem("Dmcount",Dmcount.toString());
      };
    const handleKey = (e) => {
        e.preventDefault();
        // e.code === "Enter" && handleSearch();
        SetUser42(null);
    // setUsername("")
    };
    const HandleAddFriend = (e) => {
        e.preventDefault();
        console.log("=>>> " + username);
        setErrorMessage("No User found ! " );
        
        if (AddFriend)
        {
            {
                // POST request to Backend , with User Name  of the friend to add 
                 // fetch(
                // 	'https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>',
                // 	{
                // 		method: 'POST',
                // 		body: formData,
                // 	}
                // )
                // 	.then((response) => response.json())
                // 	.then((result) => {
                // 		console.log('Success:', result);
                // 	})
                // 	.catch((error) => {
                // 		console.error('Error:', error);
                // 	});
                //Const UpadtedContacts = respobnse.json
                //setContactList(UpadtedCOntacts);
                //Send UpadtedContacts to Contact Component to keep the friendlist Up to date 
        }
    }
};
    return (
        
        <div className="FriendList-container">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        
             <div className="search">
      {/* <div className="searchForm">
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={event => setUsername(event.target.value)}
       value={username || ""}
        /> */}
          <SearchBar/>
        {/* <button type="submit" className='has-border' onClick={HandleAddFriend}>  
      <span className="icon material-symbols-outlined">
     {"person_add"}        </span> 
      </button> */}
      {/* </div> */}
      {errorMessage && <div className="error"> {errorMessage} </div>}
      {user42 && (
        <div className="userChat" onClick={handleSelect}>
          <div className="userChatInfo">
       
            <span>{contacts.map(c => < Contact  key = {c.nickname} user ={c} />)}</span>

          </div>
        </div>
      )}
    </div>
</div>
    );
};
export default ContactList;