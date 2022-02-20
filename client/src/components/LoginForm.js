// see SignupForm.js for comments
import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation} from '@apollo/client'
import {LOGIN_USER} from '../utils/mutations'
import Auth from '../utils/auth';

const LoginForm = () => {
  const [userFormInfo, setUserFormInfo] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [login, {error}] = useMutation(LOGIN_USER);

  useEffect(() => {
    if(error){
      setShowAlert(true);
    }
    else {
      setShowAlert(false)
    }
  }, [error])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormInfo({ ...userFormInfo, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const {data} = await login({
        variables: {...userFormInfo},
      });

      console.log(data);
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }

    setUserFormInfo({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert 
          dismissible 
          onClose={() => setShowAlert(false)} 
          show={showAlert} 
          variant='danger'
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormInfo.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormInfo.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormInfo.email && userFormInfo.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
