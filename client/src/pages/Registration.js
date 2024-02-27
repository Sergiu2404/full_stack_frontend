import React from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik'; //for using forms (form validaiton included)
import * as Yup from 'yup';
import axios from 'axios';

function Registration() {

    const initialValues = {
        username: "",
        password: ""
        };

        const validationSchema = Yup.object().shape({
        username: Yup.string().min(4).max(16).required(),
        password: Yup.string().min(8).max(24).required()
        });

        const onSubmit = (data) => {
            axios.post("http://localhost:8888/auth", data).then(() => {
                console.log(data);
            });
        };

  return (
    <div>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="formContainer">
            
            <label>Enter your username: </label>
            <ErrorMessage name="username" component="span" />
            <Field
                id="inputCreatePost"
                name="username"
                placeholder="username..."
            />

            <label>Enter your password: </label>
            <ErrorMessage name="password" component="span" />
            <Field
                id="inputCreatePost"
                name="password"
                type="password"
                placeholder="password..."
            />

            <button type="submit"> Register </button>
        </Form>
      </Formik>
    </div>
  )
}

export default Registration