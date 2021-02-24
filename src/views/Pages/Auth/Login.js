import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form, FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Toast, ToastBody, ToastHeader
} from 'reactstrap';
import { connect } from "react-redux";
import { Auth } from 'aws-amplify';

import { parse } from 'query-string';

import {setCurrentUser, setTempUser} from "../../../actions/authAction";
import { useForm } from 'react-hook-form';
import {inputPattern} from "../../../utils/stringHelper";
import { Button } from '../../../components/atoms';
import {PasswordInput} from "../../../components/molecules";

const logo = require('../../../assets/img/logo-delvify.svg');

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = { setCurrentUser };

const Login = (props) => {
  const { auth, history, setCurrentUser, location } = props;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const { confirmed = false } = parse(location.search);
    setConfirmed(!!confirmed);
  }, []);

  const onSubmit = useCallback(async (data) => {
    const { email, password } = data;
    setLoading(true);
    setError(null);
    try {
      const user = await Auth.signIn(email, password);
      if (user.signInUserSession) {
        setLoading(false);
        setCurrentUser(user);
      } else if (user.challengeName) {
        const challenge = user.challengeName;
        console.log(user);
        switch (challenge) {
          case 'NEW_PASSWORD_REQUIRED':
            setLoading(false);
            setCurrentUser(user);
            history.replace('/reset');
            break;
        }
      } else {
        throw new Error('No user session');
      }
    } catch (error) {
      setLoading(false);
      if (error.code === 'UserNotConfirmedException') {
        setError('User is not confirmed. Please go to your registered email to confirm.');
      } else {
        setError(error.message);
      }
      console.log('error in onSubmit: ', error);
      console.log('errorMsg in onSubmit: ', error.message);
    }
  }, []);

  const { register, handleSubmit, errors } = useForm();


  useEffect(() => {
    if (!window._.isEmpty(window._.get(auth, ['user', 'signInUserSession'], null))) {
      history.replace('/');
    }
  }, [auth]);

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <CardGroup>
              <Card className="p-4">
                <img src={logo} style={{ width: '30%', alignSelf: 'center' }}/>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Start your AI journey with us today</h2>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        invalid={!!errors.email}
                        type="email"
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
                      autoComplete="current-password"
                      name={'password'}
                      innerRef={(ref) => register(ref, { required: true })}
                      error={window._.get(errors, ['password', 'message'], null)}
                    />
                    <Row className="mt-2 d-flex justify-content-center">
                      <span className="text-danger text-center">{error}</span>
                    </Row>
                    <Row>
                      <Col xs="6">
                        <div>
                          <Link to={`/forgot-password`}>Forgot Password?</Link>
                        </div>
                        <div className="d-flex align-items-center"><span className="mr-1">No Account?</span><Link to="/register">Sign up</Link>.</div>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="primary" className="px-4" type={'submit'} loading={loading}>Login</Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>

      <Toast className="position-absolute" style={{ top: '2rem', left: '50%', transform: 'translateX(-50%)', width: '100rem' }} isOpen={confirmed} fade>
        <ToastHeader icon="success">
          Email Verified
        </ToastHeader>
        <ToastBody>
          Welcome to delvify.
        </ToastBody>
      </Toast>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
