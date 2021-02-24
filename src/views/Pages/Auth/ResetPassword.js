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
  UncontrolledPopover,
  Popover, PopoverBody, PopoverHeader,
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

const ResetPassword = (props) => {
  const { auth, history, setCurrentUser, location } = props;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const requiredAttributes = window._.get(auth, ['user', 'challengeParam', 'requiredAttributes'], []);
  const userAttributes = window._.get(auth, ['user', 'challengeParam', 'userAttributes'], {});
  const email = window._.get(auth, ['user', 'challengeParam', 'userAttributes', 'email'], parse(location.search)['email']);

  const onSubmit = useCallback(async (data) => {
    const { name, code, password } = data;
    setLoading(true);
    setError(null);
    try {
      if (auth.user) {
        const user = await Auth.completeNewPassword(auth.user, password, { name });
        console.log(user);
        user.attributes = {...window._.get(user, ['attributes'], {}), ...window._.get(user, ['challengeParam', 'userAttributes'], {})};
        if (user.signInUserSession) {
          setLoading(false);
          setCurrentUser(user);
        } else {
          throw new Error('No user session');
        }
      } else if (email) {
        await Auth.forgotPasswordSubmit(email, code, password);
        setUpdated(true);
        setLoading(false);
      } else {
        throw new Error('No user');
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

  const { register, watch, handleSubmit, errors } = useForm();

  useEffect(() => {
    if (!window._.isEmpty(window._.get(auth, ['user', 'signInUserSession'], null))) {
      history.replace('/');
    } else if (window._.isEmpty(window._.get(auth, ['user'], null)) && !email) {
      history.replace('/login');
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
                    <h2>Reset Password</h2>
                    {
                      email &&
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"/>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          invalid={!!errors.email}
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          name={'email'}
                          defaultValue={email}
                          disabled
                        />
                      </InputGroup>
                    }
                    {
                      !auth.user &&
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-options"/>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            invalid={!!errors.code}
                            type="text"
                            placeholder="Code"
                            autoComplete="code"
                            name={'code'}
                            innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.code })}
                          />
                          { errors.code && <FormFeedback>{ errors.code.message }</FormFeedback> }
                        </InputGroup>
                    }
                    {
                      requiredAttributes.includes('name') &&
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
                        </InputGroup>
                    }
                    <PasswordInput
                      className="mb-4"
                      invalid={!!errors.password}
                      placeholder="New Password"
                      name={'password'}
                      autoComplete="password"
                      innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.password })}
                      error={window._.get(errors, ['password', 'message'], null)}
                    />
                    <PasswordInput
                      className="mb-4"
                      invalid={!!errors.confirmPassword}
                      placeholder="Confirm New Password"
                      name={'confirmPassword'}
                      autoComplete="password"
                      innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.password, validate: (value) => value === watch('password') || "Password doesn't match" })}
                      error={window._.get(errors, ['confirmPassword', 'message'], null)}
                    />
                    <Row className="mt-2 d-flex justify-content-center">
                      <span className="text-danger text-center">{error}</span>
                    </Row>
                    {
                      updated &&
                      <Row className="mt-2 mb-2 d-flex justify-content-center">
                        <div>Password has been reset successfully. Please <Link to='login'>login</Link> with your new password. </div>
                      </Row>
                    }
                    <div className="text-right">
                      <Button color={updated ? 'success' : 'primary'} className="px-4" type={'submit'} loading={loading} disabled={updated}>
                        { updated ? <span><i className="fa fa-check"/> Saved</span> : 'Save' }
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
