import React, {useContext} from 'react'
import axios from "axios"; //for faster requests and responses, using instead of fetch fn form JS
import {useEffect, useState} from "react"; //for running some functions immediately after a page renders
import {useNavigate, Link} from "react-router-dom"; 
import likeImage1 from "../images/like1.png";
import likeImage2 from "../images/like2.png";
import '../styles/Home.css';


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

    return `${formattedDate}, ${formattedTime}`;
}




const Home = () => {

    const [postsList, setPostsList] = useState([]); //all posts received from API request (setPostsList - function to change the list of posts)
    const [likedPosts, setLikedPosts] = useState([]);
    //const {authententificationState} = useContext(AuthentificationContext);
    
    let navigate = useNavigate();



    useEffect(() => { //runs once when refreshing the page
        if(!localStorage.getItem("accessToken")) 
            navigate("/login"); //if loged out send user to login page
        else {

            axios.get("http://localhost:8888/posts", {headers: {
                accessToken: localStorage.getItem("accessToken")
            }}).then((response) => {
            //console.log(response.data);

            setPostsList(response.data.postsList);
            setLikedPosts(response.data.likedPosts.map((el) => {return el.PostId})); //mapping through every like corresponding to a actual user
            //console.log(response.data.likedPosts);
            });

        }
    }, []);


    const likePost = (postId) => {
        axios.post("http://localhost:8888/likes", {PostId: postId}, {headers: {
            accessToken: localStorage.getItem("accessToken") //used for validating in the backend
        }}).then((response) => {
            //alert(response.data);
            setPostsList(postsList.map((post) => { //for automatically rerendering the likes
                if(post.id === postId)
                    if(response.data.liked )
                        return {...post, Likes: [...post.Likes, 0]}; //first destructure for modifying only Likes field, second destructure for adding one more item
                    else{
                        const likesArray = post.Likes;
                        likesArray.pop(); //remove last bc we do not really care who's like is on the frontend part

                        return {...post, Likes: likesArray};
                    }
                else return post;
            }));

            if(likedPosts.includes(postId)) {//for automatically update like images
                setLikedPosts(likedPosts.filter((id) => {return id != postId})); //retrieve only posts user has not liked before
            }else{
                setLikedPosts([...likedPosts, postId]); //add like
            }
        });
    };


    return (
        <div>
            {postsList.map((value, key) => {
                return (
                  <div key="key" className="post">

                    <div className="title">
                        {value.title}
                    </div> 
                    <div className="body" onClick={() => {navigate(`/viewPost/${value.id}`)}}>
                        {value.description}
                    </div>
                    <div className="footer">
                        <div className="leftFooter">
                            <div className="username" > 
                            {/* { value.username }  */}
                                <Link to={`/profile/${value.UserId}`}> { value.username } </Link>
                            </div>
                            <div className="dateTime">{formatDateTime(value.createdAt)}</div> 
                        </div>
                        <div className="rightFooter">
                            { likedPosts.includes(value.id) ? (
                            <img src={likeImage1} onClick={() => {likePost(value.id)}} alt="like1"/>)
                            : 
                            (<img src={likeImage2} onClick={() => {likePost(value.id)}} alt="like2"/>)
                            }
                            <label>{value.Likes.length}</label>
                        </div>
                    </div>
                
                  </div>
                ); //for each element in the DB return a <div> component
            })}
        </div>
    );
}

export default Home;