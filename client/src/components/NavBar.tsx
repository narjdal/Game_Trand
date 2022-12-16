import React, {useState} from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import {useEffect} from "react";
import './Navbar.css'
import person from "./users/users.json"
import ContactList from './Friendlist/ContactList';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IsAuthOk } from '../utils/utils';

// TODO :
// Request to Backend pour avoir la FriendList 
// Add Post request to Backend pour Ajouter un ami / Bloquer un ami 

function Navbar() {
    const [click,setClick]= useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShown,setIsShown] = useState(false);
  const [allgood,setAllgood] = useState(false);

  const[user42,setUser42] = useState <any >([]);
  const[friends,setFriends] = useState <any >([]);
  const[notifs,setNotifs] = useState<any>([]);
    const [button, setButton] = useState(true);
    const [authenticated, setauthenticated] = useState("");
    const [sideBar,setSideBar] = useState(true);
    const [blur,SetBlur] = useState(false);
    const toggleSidebar = (e) => {
        document.body.classList.toggle("open");
        setSideBar(!sideBar);
        SetBlur(!blur);
    }
    const loggedInUser = localStorage.getItem("authenticated");
    const navigate = useNavigate();

    const navigateGameLanding = () => {
      navigate('/GameLanding');
    };

    const navigateHome = () => {
        // 👇️ navigate to /contacts
        console.log("NAVIGATE TO HOME ");
        navigate('/Home');
      };
      const navigateAccount = () => {
        // 👇️ navigate to /contacts
        navigate('/');
      };
      const navigateChatRooms = () => {
        // 👇️ navigate to /contacts
        navigate('/Landing');
      };
      const navigateLeaderBoard = () => {
        // 👇️ navigate to /contacts
        navigate('/LeaderBoard');
      };
      const navigatePlay = () => {
        // 👇️ navigate to /contacts
        navigate('/Pong');
      };
      const handleFriendClick = event => {
        // Toggle Shown state
        event.preventDefault();
        setIsShown(current => !current);
  FetchUserInfo();
         };
         //DOuble LogOut Component To Fixe 
        
 async function LogOut ()
         {
          const tt = localStorage.getItem("user")
          const loggedUser =JSON.parse(tt!);
          console.log(" Login Out this user   => "  + loggedUser.nickname);


let endpoint = 'http://localhost:5000/auth/logout';
// endpoint = endpoint + userQuery;
console.log(" LogOut endpoint   " + endpoint)


await fetch((endpoint),{
    mode:'no-cors',
    method:'get',
    credentials:"include"
})


.then((response) => {
  localStorage.setItem("authenticated", "false");
  localStorage.setItem("online", "");
  localStorage.setItem("action","");

    localStorage.setItem("user","");
    window.location.reload();
})
// .then(json => {
//     console.log("The response is => " + JSON.stringify(json))
//   setErrorMessage(""); 
//   if (IsAuthOk(json.statusCode) == 1)
//   {
//     console.log("SHOULD RELOAD  ....")
//   window.location.reload();
//   }

//   localStorage.setItem("authenticated", "false");
//   localStorage.setItem("user","");
//   window.location.reload();

//   // localStorage.setItem("usertoshow",JSON.stringify(json));

//     return json;
// })
.catch((error) => {
  console.log("An error occured : " + error)
  setErrorMessage("An error occured! User not found ! ");
  return error;
})


         }

      const LogUserOut = (e) => {
        e.preventDefault();
        LogOut();
    };

    async function FetchUserInfo () {

      // ]
    const loggeduser = localStorage.getItem("user");
  
    if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
    const text = ("http://localhost:5000/player/listOfFriends");
    // console.log("Social Fetch  Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      // console.log("The response is => " + JSON.stringify(json))
       if ( IsAuthOk(json.statusCode) == 1)
       {
       window.location.reload();
       }
       
          setFriends(json);
       setAllgood(true);
      return json;  
  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

    }
  }
  
      useEffect(() => {
        const authenticated = localStorage.getItem("authenticated");
    const loggeduser = localStorage.getItem("user");
      
        if (authenticated == "true") {
          setauthenticated(authenticated);
        }
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          const {id} = Current_User
          // console.log("Fetching Friends of this User " + Current_User.nickname);
          setUser42(JSON.parse(localStorage.getItem("user")!))

      // FetchUserInfo(Current_User.nickname)
      // .then((resp) => {
      //   console.log("resp => " + resp[0].id);
      //   setFriends(resp);
      //   console.log("user42.image_url" + user42.image_url)
      // })

          
          // var Current_User = JSON.parse(loggeduser!);
          // console.log("=>>>>> FROM THE NAVBAR " + loggeduser   + Current_User.nickname + Current_User.UserId)
          // setUser42(Current_User);
        }
        else
        {
          // console.log(" YOU ARE NOY LOGGED IN MY FRIEND NO USER FOUND TF IS THIS ")
          localStorage.setItem("authenticated","false");
          window.location.reload();
        }
      //  const {UserId,usual_full_name} = user42;

      },[ localStorage.getItem("user"),isShown]);
      const location = useLocation();
      // console.log("PATHNAME => " + location.pathname)
    return (
        <nav>
          <div>{( location.pathname=== "/Account_infos")  ? (
           <div>
            </div> 
          ):(
            <div>  {loggedInUser == "true" ? (
              <div>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
                 <div className="body">
            <nav className="sidebar">
              <div className="sidebar-inner">
                <header className="sidebar-header">
                  <button
                    type="button"
                    className="sidebar-burger"
                    onClick={toggleSidebar}
                  ></button>
                  
                  <img src={user42.avatar}   className="avatarsidebar" />            
               <span> {user42.nickname}</span> 
                </header>
                <nav className="sidebar-menu">
                  
                  <button type="button" onClick={navigateHome} className="has-border" >
                    <span className="icon material-symbols-outlined">
                Home 
      </span>
     <span> Home</span>
                  </button>
                  <button type="button" onClick={navigateAccount} className="has-border">
                    <span className="icon material-symbols-outlined">
     {"manage_accounts"} 
      </span>
      <span>Account</span>
                  </button>
                  <button type="button" onClick={navigatePlay}>
                <span className="icon material-symbols-outlined">
     {"videogame_asset"} 
      </span>
      <span>Play</span>
      
                  </button>
                  <button type="button" onClick={navigateGameLanding}>
                    <span className="icon material-symbols-outlined">
     {"videogame_asset"}  
      </span>
      <span>Ggane Landing</span>
                  </button>
                  <button type="button" onClick={navigateLeaderBoard} className="has-border">
                    <span className="icon material-symbols-outlined">
     {"LeaderBoard"} 
      </span>

 
     <span>LeaderBoard</span> 
                  </button>
              
                  <button type="button" onClick={navigateChatRooms}>
                    <span className="icon material-symbols-outlined">
     {"Groups"}  
      </span>
      <span>Channels</span>
                  </button>
  
                      <button type="button" className='has-border' onClick={handleFriendClick}>
                    <span className="icon material-symbols-outlined">
     {"People"}  
      </span>
      <span>
      Social
      </span>
                      </button>
                      <link
      rel="stylesheet"
      href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
    />

    <button type="button" className='has-border'>
    <span>
 
    <i   className="uil uil-heart"  >

<div className={`${notifs  ? "em-notifs" : ""}`}>
      </div>
      </i>
       <span> TODO   </span>
    </span>
  </button>
                     {isShown && ( 
                        
                      //Show the friendlist only if button is pressed
                      // Here : Send an array.map of the Friendlist of the user 
                      // get request to backend , JSON object -> parse 
                      <>
                    {allgood ? (
                      <>
                        <div className='Contact'>
                        <span>
                        
                        <ContactList contacts={friends} />
                        </span>
                      </div>
                      </>
                    ) : (
                      <>
                      </>
                    )}
                    
                      </>
                     )}
                  <button type="button" onClick={LogUserOut} style={{bottom:0}}>
                    <span className="icon material-symbols-outlined">
     {"logout"} 
      </span>
      <span> Log out</span>
                  </button>
                </nav>
              </div>
            </nav>
            </div>
             </div>
              ) : (
              <div>
                </div>
              )}</div>
               
          )}</div>
 
    
    </nav>
    
    
    )
}

export default Navbar