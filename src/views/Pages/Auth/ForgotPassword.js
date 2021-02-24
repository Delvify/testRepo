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

import {setCurrentUser, setTempUser} from "../../../actions/authAction";
import { useForm } from 'react-hook-form';
import {inputPattern} from "../../../utils/stringHelper";
import { Button } from '../../../components/atoms';

const logo = require('../../../assets/img/logo-delvify.svg');

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = { setCurrentUser };

const ForgotPassword = (props) => {
  const { auth, history, setCurrentUser, location } = props;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);

  const onSubmit = useCallback(async (data) => {
    const { email } = data;
    setLoading(true);
    setError(null);
    try {
      const result = await Auth.forgotPassword(email);
      setEmail(email);
      setLoading(false);
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
                    <h2>Forgot Password?</h2>
                    <p className="text-muted">Please input your registered email to reset the password.</p>
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
                          innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.email })}
                        />
                      </InputGroup>
                      <Row className="mt-2 d-flex justify-content-center">
                        <span className="text-danger text-center">{error}</span>
                      </Row>
                      {
                        email &&
                          <Row className="mt-2 mb-2 d-flex justify-content-center">
                            <div>We have sent the verification code to your email. Please <Link to={`reset?email=${email}`}>reset</Link> your password. </div>
                          </Row>
                      }
                      <div className="text-right">
                        <Button color={!!email ? 'success' : 'primary'} className="px-4" type={'submit'} loading={loading} disabled={!!email}>
                          { !!email ? <span><i className="fa fa-check"/> Done</span> : 'Submit' }
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
