import React, {useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from "react-router-dom"; 
import likeImage1 from "../images/like1.png";
import likeImage2 from "../images/like2.png";
import { AuthentificationContext } from '../helpers/AuthentificationContext';
import "../styles/ProfilePage.css";



function formatDateTime(timestamp) {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  });
}




function ProfilePage() {

  let { id } = useParams();
  const [username, setUsername] = useState("");
  const {authentificationState} = useContext(AuthentificationContext);



  //from Home.js
  const [postsList, setPostsList] = useState([]); //all posts received from API request (setPostsList - function to change the list of posts)
    //const [likedPosts, setLikedPosts] = useState([]);
    //const {authententificationState} = useContext(AuthentificationContext);
    
    let navigate = useNavigate();



  useEffect(() => {
    axios.get(`http://localhost:8888/auth/infoSection/${id}`).then((response) => {
        setUsername(response.data.username);
    });

    axios.get(`http://localhost:8888/posts/byuserId/${id}`).then((response) => {
        setPostsList(response.data);
    });
  }, []);

  return (
    <div className="profilePageContainer">
        {/* {authentificationState.username == username && (<button onClick={() => {navigate("/changePassword");}}> Change my password</button>)} */}
        <div className="infoSection">
            <h2> {username} </h2>
        </div>
        <div className="postsList">
          {postsList.map((value, key) => {
                return (
                  <div key="key" className="postProfile">

                    <div className="titleProfile">
                        {value.title}
                    </div> 
                    <div className="bodyProfile" onClick={() => {navigate(`/viewPost/${value.id}`)}}>
                        {value.description}
                    </div>
                    <div className="footerProfile">
                        <div className="usernameProfile"> { value.username}</div>
                        <label>{value.Likes.length}</label>
                    </div>
                    
            
                
                  </div>
                ); //for each element in the DB return a <div> component
            })}
        </div>
    </div>
  )
}

export default ProfilePage;