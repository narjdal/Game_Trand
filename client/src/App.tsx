import './App.css';
import Navbar from './components/NavBar';
// import TempoNavbar from './components/TempoNav/NavbarGame';
import Login from './components/login/login';
import React, { useEffect } from 'react';
// import { Notification } from 'react-notifications'
// import {addNotification} from 'react-notifications';
// import { iNotification } from 'react-notifications-component'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/HomePage';
import Pong from './components/pages/Pong';
import LeaderBoard from './components/pages/LeaderBoard';
import Account from './components/Account/Account';
import AboutUs from './components/pages/AboutUs';
import HowToPlay from './components/pages/HowToPlay';
import { Landing } from './components/Chatrooms/Landing';
import { ChatRoom } from './components/Chatrooms/ChatRoom';
import Friendprofile from './components/Friendlist/Friendprofile';
import Pseudo from './components/Account/Account_infos';
import CreateRoom from './components/Chatrooms/CreateRoom';
import Carreer from './components/Account/Account_pages/Carreer';
import Achievements from './components/Account/Account_pages/Achievements/Achievements'
import './AppStyle.css'
import Social from './components/Account/Account_pages/Social/Social'
import SpectateGame from './components/Game/SpectateGame';
import GameLanding from './components/Game/GameLanding';
// import { getCookies } from './utils/utils';
// import Cookies from 'js-cookie';
// import jwt from 'jwt-decode'
// import { login } from './cookies/AuthProvider';
import getProfile from './utils/fetchProfile'
import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { io } from 'socket.io-client';
import QRcode from './components/QRCode';
import axios from 'axios';
import QRCode from 'qrcode.react'
import { io } from "socket.io-client";
// import { Socket } from 'dgram';
// import socket
var socket:any;

const App = () => {
  // const accessToken = "ss";
  const [isLogged, setIslogged] = useState(false);
  const [trylogin, settrylogin] = useState(false);
  const [done, setDone] = useState(false);

  const [twofa, setTwoFa] = useState(false);
  const [QRcodeText, setQRCodeText] = useState("");
  const [twoFAcode, setTwoFAcode] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // const [qrCode,setQR] = useState <any>([]);


  useEffect(() => {
    
    if (localStorage.getItem("authenticated") === "true")
     {

      //config socket client on front end
 


      console.log("Loggin the user");
      setIslogged(true);
    }
    if (localStorage.getItem("trylogin") === "true") {
      console.log("trylogin is  true");

      if(window.location.href === "http://localhost:3000/verify")
      {
        setTwoFa(true);
      }
      else
      {
      HandleProfile();
      }
    }
  
  // if(window.location.url == "")
  }, [trylogin])


  async function HandleProfile() {

    console.log("INSIDE HANDLE PROFILE");
    await getProfile()
      .then(() => {
        // console.log("Handle Profile response is => " + response)
        settrylogin(!trylogin);
      })


  }

  useEffect(() => {

    if(twofa)
    {
      console.log("Enable TWO FA && generate QR CODE ")
      GetTwoFa();
        //  generateQRCode("sometext")
    }
  },[twofa])


  const generateQRCode = (text:string) => {
    setQRCodeText(text);
  }
async function verifyTwoFa ()
{
 let  text = ("http://localhost:5000/auth/2fa/verify");
 console.log("/2fa/verify Link :  =>  " + text);

  // console.log("creating this room : "  + roomState + " Name : " + RoomName + " Password : " + password + " Owner : " + Current_User.nickname);
        await fetch(text,{
          // mode:'no-cors',
          method:'post',
          credentials:"include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
              { 
            // roomState: roomState,
            // name: RoomName,
            code: twoFAcode,}
              )
      })
      
      .then((response) => response.json())
      .then(json => {
          console.log("The 2fa/verify resp  is => " + JSON.stringify(json))

        // navigate('/Landing')
        // window.location.reload();
        if(json.statusCode == "401")
        {
          setErrorMessage("An Error occured ! Are you sure this is the correct code ? ")
        }
        else if (json.statusCode == "404")
        {
          console.log(" HELLO ITS ME ")
          setErrorMessage(json.message)
        }
        else
        {
          HandleProfile();
          setTwoFa(false);
          window.location.href = "http://localhost:3000/"
        }
          return json;
      })
      .catch((error) => {
          console.log("An error occured in 2fa/verify  : " + error)
          return error;
      })
    
        }

  const SendtwoFaCode = (e) => {
    e.preventDefault();
    console.log("SENDING THE CODE ")
    if(twoFAcode)
    {
      verifyTwoFa();
    }
    else
    {
      setErrorMessage("Code can't be empty !")
    }
  }
async function GetTwoFa () {




  const text = "http://localhost:5000/auth/2fa/QrCode" ;
  console.log("/2fa/QrCode Link :  =>  " + text);

  

  await axios.get(text,
    {withCredentials:true}
    // mode:'no-cors',
    // method:'get',
    // credentials:"include"
  )

// .then((response) => response.json())
.then(json => {
    // json.data.id = params.id;
  console.log("The /2fa/QrCode esp : " + JSON.stringify(json.data));
  
  // setQR(json.data)
  generateQRCode(json.data.otpauth_url)
    // setQRCodeText(json.data);
  setDone(true);
  // generateQRCode(json.data)
})
.catch((error) => {
  // setErrorMessage("An error occured ! You cannot access this room.")
  setErrorMessage("An error occured ! Cannot display the QR CODE .")

  // generateQRCode(error)
  
  // setDone(true);
    console.log("An error occured  while fetching the /2fa/enable  : " + error)
    return error;
})

}


useEffect(() => {
  
  if(isLogged)
  {
    socket = io("http://localhost:5000");
    console.log("Hadik hya:",localStorage.getItem("user"));

    socket.emit("onlineUsersBack", 
    { 
      user: JSON.parse(localStorage.getItem("user")!) 
     });
    
    console.log("socket is connecting ", socket);
      socket.on("onlineUsersFront", (data: any) => {
      console.log("OnLine e e e e e: ", data);
      localStorage.setItem("online",JSON.stringify(data))
    });
                // onlineUsersFront

  }
  return () => {
    // localStorage.setItem("online","");
  }

},[isLogged])

  if(twofa)
  {

  
    console.log("TWO FA IS TRUE HE IS TRYING TO LOGIN.");
    return (
      <>
      <div className='QR-card'>
        
        {done ? (
          <>
            <QRCode
        id="qrCodeEl"
        size={150}
        value={QRcodeText}
      />
      <br/>

        <input
          type="text"
          placeholder="Enter Two FA Password"
          value={twoFAcode}
          onChange={e => setTwoFAcode(e.target.value)}
        />
      <br/>

        <button onClick={SendtwoFaCode} >
          ENTER
        </button>
          </>
        ) : (
          <>
          
          </>
        )}
                {errorMessage && <div className="error"> {errorMessage} </div>}

    
        </div>
      </>
    )
  }
  // else
  // {
    
  // }


  if (!isLogged) {
    console.log("You are not logged in.");
    return (
      <>
        <Router>
          <button onClick={(e) => localStorage.setItem("trylogin", "true")}> <Login />
          </button>

        </Router>
      </>
    )
  }
  // else if (twofa)
  // {

  // }
  else {


    // const user = localStorage.getItem("user");
    // console.log(" User Object  =>   " + user)

    // const socket = io("http://localhost:5000");
    // console.log("socket is connecting ");


    
    // socket.on("dm", () => {
    //   console.log("connected");
    // });
 
    return (
      <div className="App">
        {/* <link rel="stylesheet" href="toruskit.blobz/blobz.min.css" />
      <div className="tk-blob">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 747.2 726.7">
    <path d="M539.8 137.6c98.3 69 183.5 124 203 198.4 19.3 74.4-27.1 168.2-93.8 245-66.8 76.8-153.8 136.6-254.2 144.9-100.6 8.2-214.7-35.1-292.7-122.5S-18.1 384.1 7.4 259.8C33 135.6 126.3 19 228.5 2.2c102.1-16.8 213.2 66.3 311.3 135.4z"></path>
  </svg>
</div>
<div className="tk-blob" >
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.6 385.5">
    <path d="M381.4 86.5c43.5 48 77.5 110.3 68.8 168.7-8.6 58.4-59.9 113-114.8 126.7-54.9 13.6-113.4-13.7-176.6-40.6-63.1-27-130.7-53.5-151.5-102.8-20.9-49.2 5.1-121.1 50.3-169.5C102.8 20.7 167.1-3.9 225.9.5c58.8 4.5 111.9 38.1 155.5 86z"></path>
  </svg>
</div> */}
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Account />} />
            <Route path='/Pong' element={<Pong />} />
            <Route path='/LeaderBoard' element={<LeaderBoard />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/Account_infos' element={<Pseudo />} />
            <Route path='/AboutUs' element={<AboutUs />} />
            <Route path='/HowToPlay' element={<HowToPlay />} />
            <Route path="/Landing" element={<Landing />} />
            <Route path="/room/:id" element={<ChatRoom />} />
            <Route path="/Carreer/:id" element={<Carreer />} />
            <Route path="/SpectateGame/:id" element={<SpectateGame />} />
            <Route path="/GameLanding" element={<GameLanding />} />

            <Route path="/CreateRoom" element={<CreateRoom />} />
            <Route path="/users/:nickname" element={<Friendprofile />} />
            <Route path="/Achievements" element={<Achievements />} />
            <Route path="/Social" element={<Social />} />
            <Route path="/verify" element={<QRcode />} />



          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
