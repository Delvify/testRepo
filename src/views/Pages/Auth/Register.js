import React, { useState, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form, FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label, Modal, ModalBody, ModalHeader, Popover, PopoverBody,
  Row
} from 'reactstrap';
import {SketchPicker} from "react-color";
import { useForm } from 'react-hook-form';
import jwtDecode from "jwt-decode";
import {inputPattern} from "../../../utils/stringHelper";
import {Auth} from "aws-amplify";
import CardHeader from "reactstrap/es/CardHeader";
import { Button } from '../../../components/atoms';
import {Link} from "react-router-dom";
import {PasswordInput} from "../../../components/molecules";

const logo = require('../../../assets/img/logo-delvify.svg');

const RegisterForm = (props) => {
  const { onSuccess } = props;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    console.log(data);
    const { name, email, password } = data;
    try {
      const result = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name
        }
      });
      // navigate(`/confirmation?email=${email}`, { replace: true });
      setLoading(false);
      onSuccess(result);
    } catch (error) {
      setLoading(false);
      console.log('error in onSubmit: ', error);
      if (error.code === 'UsernameExistsException') {
        setFormError('email', 'Existed', error.message);
      } else {
        setError(error.message);
      }
    }
  }, []);

  const { register, watch, handleSubmit, errors, setError: setFormError } = useForm();
  return (
    <Card  className="p-4">
      <img src={logo} style={{ width: '30%', alignSelf: 'center' }}/>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h1>Sign Up</h1>
          <p className="text-muted">Create a new account to get started with Delvify (Smart Platform)</p>
          <InputGroup className="mb-4">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="icon-bag"/>
              </InputGroupText>
            </InputGroupAddon>
            <Input
              invalid={!!errors.name}
              type="text"
              placeholder="Company Name"
              name={'name'}
              autoComplete="company-name"
              innerRef={(ref) => register(ref, { required: true })}
            />
            { errors.name && <FormFeedback>{ errors.name.message }</FormFeedback> }
          </InputGroup>
          <InputGroup className="mb-4">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>@</InputGroupText>
            </InputGroupAddon>
            <Input
              invalid={!!errors.email}
              type="text"
              placeholder="Email"
              autoComplete="email"
              name={'email'}
              innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.email })}
            />
            { errors.email && <FormFeedback>{ errors.email.message }</FormFeedback> }
          </InputGroup>
          <PasswordInput
            className="mb-4"
            invalid={!!errors.password}
            placeholder="Password"
            name={'password'}
            autoComplete="password"
            innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.password })}
            error={window._.get(errors, ['password', 'message'], null)}
          />
          <PasswordInput
            className="mb-4"
            invalid={!!errors.confirmPassword}
            placeholder="Confirm Password"
            name={'confirmPassword'}
            autoComplete="password"
            innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.password, validate: (value) => value === watch('password') || "Password doesn't match" })}
            error={window._.get(errors, ['confirmPassword', 'message'], null)}
          />
          <Row className="mt-2 d-flex justify-content-center">
            <span className="text-danger text-center">{error}</span>
          </Row>
          <Button color="success" block loading={loading} className="mt-3">Create Account</Button>
          <div className="text-muted text-center">By signing up you agree to the <a href="https://delvify.io/legal/" target="_blank">Terms of Service</a>.</div>
        </Form>
        <div className="d-flex align-items-center justify-content-center"><span className="mr-1">Have an account?</span><Link to="/login">Login here</Link>.</div>
      </CardBody>
    </Card>
  )};

const SucceededCard = () => {
  return (
    <Card className="p-4">
      <img src={logo} style={{ width: '30%', alignSelf: 'center' }}/>
      <CardBody>
          <h1>Done!</h1>
          <p className="text-muted">Please go to your registered email for verification.</p>
      </CardBody>
    </Card>
  )};

const Register = (props) => {
  const { history } = props;
  const [succeeded, setSucceeded] = useState(false);
  const onSuccess = useCallback((result) => {
    console.log(result);
    setSucceeded(true);
  }, []);

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            { !succeeded ? <RegisterForm onSuccess={onSuccess} history={history}/> : <SucceededCard />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
