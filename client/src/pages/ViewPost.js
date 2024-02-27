import React, {useEffect, useState, useContext} from 'react'; //useEffect from fetching the data from the Post
import '../styles/ViewPost.css';

import {useParams, useNavigate} from "react-router-dom"; //for getting the params out of path (id)
import axios from 'axios';
import { AuthentificationContext } from '../helpers/AuthentificationContext';




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





function ViewPost() {

  let {id} = useParams(); //need exact the same name put for params (form path -> id)

  const [postObject, setPostObject] = useState({}); //for holding data and display it
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const {authentificationState} = useContext(AuthentificationContext);

  let navigate = useNavigate(); //after deleting a post



  useEffect(() => {
    axios.get(`http://localhost:8888/posts/byId/${id}`).then((response) => {
        console.log(response.data);
        setPostObject(response.data);
    });

    axios.get(`http://localhost:8888/comments/${id}`).then((response) => {
        console.log(response.data);
        setComments(response.data);
    });
  }, []); //[] used bc otherwise it gets into an infinite loop:
  // Function useEffect((function here), [ ] ) basically loads up at the first
  //time when you open up a webpage or a page is refreshed. It works as useEffect( whattodo, [whentodo] );
  // type of function. So, if you pass [ ] or empty dependency array, it will loads up when refreshed or opening the page.

  const addComment = () => {
    axios.post("http://localhost:8888/comments", {
        commentBody: newComment,
        PostId: id
    }, 
    { //config object the request
        headers:{
            accessToken: localStorage.getItem("accessToken"),
        }
    }
    )
    .then((response) => {
        //console.log("new comment added")
        if(response.data.error) {
            console.log(response.data.error);
            alert(response.data.error);
        }
        else{
            const commentToAdd = {commentBody: newComment, username: response.data.username, id: response.data.id};
            setComments([...comments, commentToAdd]); //grabbing previous elements of the array and add the new comment to the end, such that the comment is not added only when refreshing (it is added directly)
            setNewComment(""); 
        }

    });
  }

  const deleteComment = (id) => {
    axios.delete(`http://localhost:8888/comments/${id}`, { //config object the request
    headers:{
        accessToken: localStorage.getItem("accessToken")
    }
}).then(() => {
    setComments(comments.filter((el) => {
        return el.id !== id;
    }));
    //use filter function for keeping only comments that have not the id of the one that we want to delete
})}

    const deletePost = (id) =>{
        axios.delete(`http://localhost:8888/posts/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            //alert("delete works!!!!");
            navigate("/"); //home page after delete post
        })
    };



    const updatePost = (option) => {
        if(option === "title"){
            let newTitle = prompt("New title..."); //prompt used for updating

            axios.put(
              "http://localhost:8888/posts/title",
              {newTitle: newTitle, id: id},
              {headers: {accessToken: localStorage.getItem("accessToken")}});

            setPostObject({...postObject, title: newTitle}); //the state of postObject modifies only at the title (destructuring used)
        }
        else{
            let newDescription = prompt("New description...");

            axios.put(
                "http://localhost:8888/posts/description",
                {newDescription: newDescription, id: id},
                {headers: {accessToken: localStorage.getItem("accessToken")}});

            setPostObject({...postObject, description: newDescription});
        }

    }



  return (
    <div className="postPage">
        <div className="leftSide">
            <div className='post' id='individual'>
                <div className="title" onClick={() => { 
                    if(authentificationState.username === postObject.username) 
                        updatePost("title");
                    }}>
                    {postObject.title}
                </div>
                <div className="body" onClick={() => {
                    if(authentificationState.username === postObject.username)
                         updatePost("body");
                    }}>
                    {postObject.description}
                </div>
                <div className="footer">
                    {postObject.username}
                </div>
                <div className="dateAndTime">
                        {formatDateTime(postObject.createdAt)}
                    </div>
                { authentificationState.username === postObject.username &&//javascript
                    (<button onClick={() => {deletePost(postObject.id);}}> delete your post </button>)
                }
            </div>
        </div>
        <div className='rightSide'>
            <div className="addCommentContainer">
                <input 
                type="text" 
                placeholder="write your comment..." 
                autoComplete="off" 
                value={newComment}
                onChange={(event) => {
                    setNewComment(event.target.value);
                }}
                />
                <button onClick={addComment}> add your comment </button>
            </div>
            <div className="listOfComments">
                {comments.map((comment, key) => {
                    return (
                        <div key={key} className="comment">
                             <div className="commentBody">
                                {comment.commentBody}
                             </div>
                             <label>{comment.username}</label>
                             {authentificationState.username === comment.username && (<button onClick={() => {deleteComment(comment.id)}}> X </button>)}
                             {postObject.createdAt && (
                            <div className="dateTime">{formatDateTime(postObject.createdAt)}</div>
                        )}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  )
}

export default ViewPost