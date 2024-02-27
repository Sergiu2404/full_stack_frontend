import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/CreatePost.css";

import {Formik, Form, Field, ErrorMessage} from 'formik'; //for using forms (form validaiton included)
import * as Yup from 'yup';
import axios from "axios";
import { AuthentificationContext } from '../helpers/AuthentificationContext';




function CreatePost() {
  //for redirecting after creating a post
  const { AuthentificationState } = useContext(AuthentificationContext);
  let navigate = useNavigate();


  useEffect(() => {
    if(!localStorage.getItem("accessToken"))
      navigate("/login");
  }, []);


  const initialValues = {
    title: "",
    description: ""
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a title"),
    description: Yup.string()
  });

  const onSubmit = (data) => {
    

    axios.post("http://localhost:8888/posts", data, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
        console.log("Posting worked: " + response.data);
        navigate("/"); //redirect to the home page after creating new post
        });
  };


  return (
    <div className="createPostPage">
      <div className="text">
        <label>Share</label>
        <label>Your Thoughts</label>
        <label>Here....</label>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="give title..."
          />

          <label>Post description: </label>
          <ErrorMessage name="description" component="span" />
          <Field
        
            id="inputCreatePost"
            name="description"
            placeholder="give description..."
          />

          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}
export default CreatePost