import './styles/App.css';
import { Routes, Route, BrowserRouter, Link, useSwitch} from 'react-router-dom';

import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import ViewPost from './pages/ViewPost';
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import {AuthentificationContext} from "./helpers/AuthentificationContext";
import {useState, useEffect} from 'react';
import axios from 'axios';
import MyPage from "./pages/ProfilePage";
import ChangePassword from './pages/ChangePassword';
//import ChangePassword from './pages/ChangePassword';


// import axios from "axios"; //for faster requests and responses, using instead of fetch fn form JS
// import {useEffect, useState} from "react"; //for running a functions immediately after a page renders




function App(){

  // const [postsList, setPostsList] = useState([]); //all posts received from API request (setPostsList - function to change the list of posts)

  //   useEffect(() => { //runs once when refreshing the page
  //       axios.get("http://localhost:8888/posts").then((response) => {
  //       //console.log(response.data);
  //       setPostsList(response.data);
  //       });
  //   }, []);
  const [authentificationState, setAuthentificationState] = useState(
    {
    username: "",
    id: 0,
    status: false
    }
    ); //determines if we are logged in or not


  useEffect(() => {
    axios.get("http://localhost:8888/auth/auth", {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
      if(response.data.error) 
        setAuthentificationState({...authentificationState, status: false}); //grabbing the authentifState and set status to false without modifying username and id
      else 
        setAuthentificationState({
      username: response.data.username,
      id: response.data.id,
      status: true
      });
    });
  }, []);



  //for logout button
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthentificationState({username: "", id: 0, status: false}); //no more logged in
  }



  return (
    <div className="App">
      <AuthentificationContext.Provider value={{authentificationState, setAuthentificationState}}>
        <BrowserRouter>
          <div className="navbar">
            
            { !authentificationState.status ? (
            <>
              <Link to="/login"> Login Page </Link>
              <Link to="/registration"> Register </Link>
            </>
            ) : (
            <>
              <Link to="/"> Go to Home Page </Link>
              <Link to="/createPost"> Create Your Own Post </Link>
              <button onClick={logout}> Log Out </button>
              {/* <Link to={`/profile/${value.UserId}`}> { value.username } </Link> */}
            </>
            )}

          <h3> Connected as {authentificationState.username}</h3>
          </div>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/createPost" element={<CreatePost/>}/>
            <Route path="/viewPost/:id" element={<ViewPost/>}/> 
            <Route path="/registration" element={<Registration/>}/>
            <Route path="/login" element={<Login/>}/> 
            <Route path="/profile/:id" element={<MyPage/>}/> 
            <Route path="/changePassword" element={<ChangePassword/>}/> 
            <Route path="*" component={Error} />
          </Routes>
        </BrowserRouter> 
      </AuthentificationContext.Provider>
      {/* <div>
            {postsList.map((value, key) => {
            return (
            <div className="post">

                <div className="title">
                    {value.title}
                </div> 
                <div className="body">
                    {value.description}
                </div>
                <div className="footer">
                    {value.username}
                </div>
            
            </div>
            ); //for each element in the DB return a <div> component
        })}
        </div> */}
    </div> //path: /post/:id -> /post/23 (the post with id 23)
  );
}



// function NavigationLinks() {
//   const navigate = useNavigate();

//   return (
//     <div>
//       {navigate && navigate.location.pathname === '/' && (
//         <Link to="/createPost">Create Your Own Post</Link>
//       )}
//       {navigate && navigate.location.pathname === '/createPost' && (
//         <Link to="/">Go to Home Page</Link>
//       )}
//     </div>
//   );
// }


export default App;
