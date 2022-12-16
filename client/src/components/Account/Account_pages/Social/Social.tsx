import react from 'react'
import {useState,useEffect} from 'react'
import './Social.css'
import DisplaySocial from './DisplaySocialList'
import { IsAuthOk } from '../../../../utils/utils'
const Social = () => {
    console.log("INSIDE SOCIAAAAAAL")
    // const FriendsList = [
    //     {id:0,UserId:50223,nickname:"narjdal",username:"narjdal",name:"narjdal",image_url:"/images/AccountDefault.png"},
    //     {id:1,UserId:50229,nickname:"mazoko",username:"mazoko",name:"mazoko",image_url:"/images/AccountDefault.png"},
    //     {id:2,UserId:50231,nickname:"testPlayer",username:"testPlayer",name:"testPlayer",image_url:"/images/AccountDefault.png"},
    //     {id:3,UserId:50233,nickname:"test",username:"test",name:"test",image_url:"/images/AccountDefault.png"},
    //     {id:4,UserId:50235,nickname:"Friend4",username:"Friend4",name:"Friend4",image_url:"/images/AccountDefault.png"},
        
    // ];
  const[friends,setFriends] = useState <any >([]);
    async function FetchUserInfo (nickname) {

        // ]
      const loggeduser = localStorage.getItem("user");
    
      if(loggeduser)
    {
      var Current_User = JSON.parse(loggeduser);
      const text = ("http://localhost:5000/player/listOfFriends");
      console.log("Api Fetch Link :  =>  " + text);
      
  
      await fetch(text,{
        // mode:'no-cors',
        method:'get',
        credentials:"include"
    })
    
    .then((response) => response.json())
    .then(json => {
        console.log("The response is => " + JSON.stringify(json))
        if(IsAuthOk(json.satusCode) == 1)
        {
          window.location.reload();
        }
        if(json.statusCode == "404")
        return;
        else
        
        setFriends(json);
    
        return json;
    })
    .catch((error) => {
        console.log("An error occured : " + error)
        return error;
    })
  
      }
    }
    
    useEffect(() => {
        const loggeduser = localStorage.getItem("user");
      
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          const {id} = Current_User
          console.log("Fetching Friends of this User " + Current_User.nickname);

      FetchUserInfo(Current_User.nickname)
        }
    },[])
    return (
        <>
        <div className='body'>
            <div className='Social-card'>
                <h3>Social</h3>
            <span>{friends.map(c => < DisplaySocial  key = {c.id} Friends ={c} />)}</span>

            </div>
        </div>
        </>
    )
}

export default Social;