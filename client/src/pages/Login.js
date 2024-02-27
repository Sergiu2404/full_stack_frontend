import React from 'react';
import {useState, useContext} from "react";
import "../styles/Login.css";

import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import { AuthentificationContext } from '../helpers/AuthentificationContext';



function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setAuthentificationState} = useContext(AuthentificationContext);

  let navigate = useNavigate();

  const login = () => {
    const data = {username: username, password, password}; //create object of username and password fields being the username and password that we are passing

    axios.post("http://localhost:8888/auth/login", data).then((response) => {
        if(response.data.error) //if response contains error field, throw alert box
            alert(response.data.error);
        else{
            localStorage.setItem("accessToken", response.data.token);
            setAuthentificationState({username: response.data.username, id: response.data.id, status: true}); //when logged in, authState is changed such that login and register links dissappear from the header
            navigate("/"); //if succesfully logged in => navigate to home page
        }
        //console.log(response.data);
    })
  }

  return (
    <div className="loginContainer">
        <label>Enter your username: </label>
        <input type="text" onChange={(event) => {setUsername(event.target.value)}}/>
        <label>Enter your password: </label>
        <input type="password" onChange={(event) => {setPassword(event.target.value)}}/>

        <button onClick={login}>Login</button>
    </div>
  )
}

export default Login