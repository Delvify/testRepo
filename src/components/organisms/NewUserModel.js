import React, { useState, useCallback, useEffect } from 'react';
import {
  Badge,
  Col, Form, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Label,
  Modal,
  ModalBody,
  ModalHeader, Row, Table as TableComponent
} from "reactstrap";
import PropTypes from "prop-types";
import FormGroup from "reactstrap/es/FormGroup";
import {inputPattern} from "../../utils/stringHelper";
import {Button} from "../atoms";
import {API} from "aws-amplify";
import {useForm} from "react-hook-form";
import {PasswordInput} from "../molecules";

const NewUserModel = (props) => {
  const { isOpen, onClose, accessToken, onUpdated } = props;

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModalHandler = useCallback(() => {
    setSuccess(false);
    onClose();
  }, [onClose]);

  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    console.log(data);
    const { name, email, password, isSendInvitation, isAdmin } = data;
    let myInit = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: accessToken
      },
      body: {
        name,
        email,
        password,
        isSendInvitation,
        isAdmin
      }
    };
    try {
      const result = await API.post('AdminQueries', '/createUser', myInit);
      setSuccess(true);
      console.log(result);
      setLoading(false);
      onUpdated();
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
    <Modal isOpen={isOpen} toggle={closeModalHandler} className="modal-lg">
      <ModalHeader toggle={closeModalHandler} />
      <ModalBody>
        <h3>New User</h3>
        <p className="text-muted">Create a new account</p>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
          { errors.name && <FormFeedback>{ errors.name.message }</FormFeedback> }
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
            placeholder="Temporary Password"
            name={'password'}
            autoComplete="password"
            innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.password })}
            error={window._.get(errors, ['password', 'message'], null)}
          />
          <PasswordInput
            className="mb-4"
            invalid={!!errors.confirmPassword}
            placeholder="Confirm Temporary Password"
            name={'confirmPassword'}
            autoComplete="password"
            innerRef={(ref) => register(ref, { required: true, pattern: inputPattern.password, validate: (value) => value === watch('password') || "Password doesn't match" })}
            error={window._.get(errors, ['confirmPassword', 'message'], null)}
          />
          <Row>
            <Col>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name={'isSendInvitation'}
                    innerRef={(ref) => register(ref)}
                  />{' '}Send Email Invitation?
                </Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name={'isAdmin'}
                    innerRef={(ref) => register(ref)}
                  />{' '}Is Admin?
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-2 d-flex justify-content-center">
            <span className="text-danger text-center">{error}</span>
          </Row>
          <Button color={success ? 'success' : 'primary'} disabled={success} block loading={loading} className="mt-3">
            { success ? <span><i className="fa fa-check"/> Done</span> : 'Create Account' }
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
};

NewUserModel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
};

NewUserModel.defaultProps = {
  isOpen: false,
  onClose: () => {},
  accessToken: '',
};

export default NewUserModel;
