import React, { useState, useCallback, useEffect } from 'react';
import {
  Badge,
  Col, Form, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Label,
  Modal,
  ModalBody,
  ModalHeader, Row, Table
} from "reactstrap";
import PropTypes from "prop-types";
import FormGroup from "reactstrap/es/FormGroup";
import {dateFormat, inputPattern} from "../../utils/stringHelper";
import {Button} from "../atoms";
import {API, graphqlOperation} from "aws-amplify";
import {useForm} from "react-hook-form";
import {PasswordInput} from "../molecules";
import moment from "moment";
import ConfirmModal from "./ConfirmModal";
import styled from "@emotion/styled";
import { color } from '../../utils/styleVariables';
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

const LoadingField = (props) => {
  const { loading, children } = props;
  return loading ? <i className="fa fa-spin fa-spinner"/> : children;
};

LoadingField.prototype = { loading: PropTypes.bool };
LoadingField.defaultProps = { loading: false };

const LabelTop = styled('div')({
  color: color.text.label,
  fontSize: '11px',
});

const EditUserModal = (props) => {
  const { isOpen, onClose, accessToken, userID, onUpdated, isSelf } = props;

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [trainingStatusLoading, setTrainingStatusLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [tagConfig, setTagConfig] = useState({
    productDetailUrl: null,
    sku: {},
    cta: {},
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (userID) {
      initialize(userID);
    }
  }, [userID]);

  const toggleConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(!isConfirmModalOpen);
  }, [isConfirmModalOpen]);

  const toggleModalHandler = useCallback(() => {
    setSuccess(false);
    setUser({});
    setTrainingStatus(false);
    setInitializing(false);
    onClose();
  }, [onClose, isOpen]);

  const initialize = useCallback(async (userID) => {
    setInitializing(true);
    await getUser(userID);
    await getConfig(userID);
    setInitializing(false);
  });

  const getUser = useCallback(async (userID) => {
    let myInit = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: accessToken
      }
    };
    try {
      const user = await API.get('AdminQueries', `/getUser/${userID}`, myInit);
      if (!user.isAdmin) {
        getTrainingStatus(userID);
      }
      await setUser(user);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getConfig = useCallback(async (userID) => {
    const { data: userData } = await API.graphql(graphqlOperation(queries.getUser, { id: userID }));
    console.log(userData.getUser);
    if (userData.getUser && userData.getUser.tagConfig ) {
      setTagConfig(userData.getUser.tagConfig);
      console.log(userData.getUser.tagConfig);
    }
  }, []);

  const getTrainingStatus = useCallback(async (userID) => {
    setTrainingStatusLoading(true);
    const trainStatus = await API.post('mlserverapi', '/mlserverapi', { body: { endpoint: 'trainStatus', userID: userID }});
    setTrainingStatus(trainStatus);
    setTrainingStatusLoading(false);
  }, []);

  const onRemove = useCallback(async () => {
    try {
      let myInit = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken
        }
      };
      await API.post('AdminQueries', `/deleteUser/${userID}`, myInit);
      onClose();
      onUpdated();
    } catch (e) {
      console.log(e);
    }
  }, [userID]);

  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    console.log(data);
    const { name, isAdmin, productDetailUrl, skuTag, skuAttribute, skuValue, skuIndex, ctaTag, ctaAttribute, ctaValue, ctaIndex } = data;
    const tagConfig = productDetailUrl ? {
      productDetailUrl: productDetailUrl,
      ...skuTag && skuAttribute && skuValue ? { sku: {
        tag: skuTag,
        attribute: skuAttribute,
        value: skuValue,
        index: skuIndex,
      }} : {},
      ...ctaTag && ctaAttribute && ctaValue ? { cta: {
        tag: ctaTag,
        attribute: ctaAttribute,
        value: ctaValue,
        index: ctaIndex,
      }} : {}
    } : null;
    let myInit = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: accessToken
      },
      body: {
        name,
        ...isAdmin === user.isAdmin ? {} : { isAdmin },
        ...tagConfig === tagConfig ? { tagConfig } : {}
      }
    };
    console.log(myInit);
    try {
      await API.put('AdminQueries', `/updateUser/${userID}`, myInit);
      setSuccess(true);
      setLoading(false);
      onUpdated();
    } catch (error) {
      setLoading(false);
      console.log('error in onSubmit: ', error);
      setError(error.message);
    }
  }, [user, userID]);

  const { register, watch, handleSubmit, errors, setError: setFormError } = useForm();

  return (
    <Modal isOpen={isOpen} toggle={toggleModalHandler} className="modal-lg">
      <ModalHeader toggle={toggleModalHandler}>Edit User</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-2">
            <Col sm={2}>Email:</Col>
            <Col sm={10}>
              <LoadingField loading={initializing}>
                {user.email} <i className={`fa ${user.isConfirmed ? 'fa-check-circle' : 'fa-times'} text-${user.isConfirmed ? 'success' : 'danger'}`}/>
              </LoadingField>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup row className="mb-2">
                <Label htmlFor="name" sm={4}>Name:</Label>
                <Col>
                  <LoadingField loading={initializing}>
                    <Input
                      invalid={!!errors.name}
                      type="text"
                      placeholder="Company Name"
                      name={'name'}
                      autoComplete="company-name"
                      defaultValue={user.name}
                      innerRef={(ref) => register(ref, { required: true })}
                    />
                  </LoadingField>
                </Col>
                { errors.name && <FormFeedback>{ errors.name.message }</FormFeedback> }
              </FormGroup>
            </Col>
            <Col>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name={'isAdmin'}
                    innerRef={(ref) => register(ref)}
                    defaultChecked={user.isAdmin}
                  />{' '}Is Admin?
                </Label>
              </FormGroup>
            </Col>
          </Row>
          {
            !user.isAdmin &&
            <FormGroup row className="mb-2">
              <Label htmlFor="productDetailUrl" sm={2}>Product Detail URL:</Label>
              <Col>
                <LoadingField loading={initializing}>
                  <Input
                    type="text"
                    placeholder="e.g. https://www.shop.com/detail/*"
                    name={'productDetailUrl'}
                    defaultValue={tagConfig.productDetailUrl}
                    innerRef={(ref) => register(ref)}
                  />
                </LoadingField>
              </Col>
            </FormGroup>
          }
          {
            !user.isAdmin &&
            <Row>
              <Col sm={2}>SKU DOM:</Col>
              <Col>
                <FormGroup className="mb-2">
                  <LabelTop htmlFor="skuTag">Tag</LabelTop>
                  <LoadingField loading={initializing}>
                    <Input
                      type="text"
                      placeholder="e.g. div"
                      name={'skuTag'}
                      defaultValue={tagConfig.sku.tag}
                      innerRef={(ref) => register(ref)}
                    />
                  </LoadingField>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="mb-2">
                  <LabelTop htmlFor="skuAttribute">Attribute</LabelTop>
                  <LoadingField loading={initializing}>
                    <Input
                      type="text"
                      placeholder="e.g. id"
                      name={'skuAttribute'}
                      defaultValue={tagConfig.sku.attribute}
                      innerRef={(ref) => register(ref)}
                    />
                  </LoadingField>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="mb-2">
                  <LabelTop htmlFor="skuValue">Value</LabelTop>
                  <LoadingField loading={initializing}>
                    <Input
                      type="text"
                      placeholder="e.g. sku"
                      name={'skuValue'}
                      defaultValue={tagConfig.sku.value}
                      innerRef={(ref) => register(ref)}
                    />
                  </LoadingField>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="mb-2">
                  <LabelTop htmlFor="skuIndex">Index</LabelTop>
                  <LoadingField loading={initializing}>
                    <Input
                      type="select"
                      name={'skuIndex'}
                      defaultValue={tagConfig.sku.index}
                      innerRef={(ref) => register(ref)}
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Input>
                  </LoadingField>
                </FormGroup>
              </Col>
            </Row>
          }
          {
            !user.isAdmin &&
            <Row>
              <Col sm={2}>CTA Button DOM:</Col>
              <Col>
                <FormGroup className="mb-2">
                  <LabelTop htmlFor="ctaTag">Tag</LabelTop>
                  <LoadingField loading={initializing}>
                    <Input
                      type="text"
                      placeholder="e.g. a"
                      name={'ctaTag'}
                      defaultValue={tagConfig.cta.tag}
                      innerRef={(ref) => register(ref)}
                    />
                  </LoadingField>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="mb-2">
                  <LabelTop htmlFor="ctaAttribute">Attribute</LabelTop>
                  <LoadingField loading={initializing}>
                    <Input
                      type="text"
                      placeholder="e.g. label"
                      name={'ctaAttribute'}
                      defaultValue={tagConfig.cta.attribute}
                      innerRef={(ref) => register(ref)}
                    />
                  </LoadingField>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="mb-2">
                  <LabelTop htmlFor="ctaValue">Value</LabelTop>
                  <LoadingField loading={initializing}>
                    <Input
                      type="text"
                      placeholder="e.g. Add To Cart"
                      name={'ctaValue'}
                      defaultValue={tagConfig.cta.value}
                      innerRef={(ref) => register(ref)}
                    />
                  </LoadingField>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="mb-2">
                  <LabelTop htmlFor="ctaIndex">Index</LabelTop>
                  <LoadingField loading={initializing}>
                    <Input
                      type="select"
                      name={'ctaIndex'}
                      defaultValue={tagConfig.cta.index}
                      innerRef={(ref) => register(ref)}
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Input>
                  </LoadingField>
                </FormGroup>
              </Col>
            </Row>
          }
          {
            !user.isAdmin &&
              <Row className="mb-2">
                <Col sm={2}>Widgets:</Col>
                <Col sm={10}>
                  <LoadingField loading={initializing}>
                    {window._.get(user, ['smartSKU', 'widgets'], []).length}
                  </LoadingField>
                </Col>
              </Row>
          }
          {
            !user.isAdmin &&
              <Row className="mb-2">
                <Col sm={2}>File Uploaded:</Col>
                <Col sm={10}>
                  <LoadingField loading={initializing}>
                    {
                      user.file ?
                        <span>Number of items: {window._.get(user, ['file', 'items'], 0)} | Updated
                          At: {moment(window._.get(user, ['file', 'updatedAt'])).format(dateFormat())}</span> :
                        <i className='fa fa-times text-danger'/>
                    }
                  </LoadingField>
                </Col>
              </Row>
          }
          {
            !user.isAdmin &&
              <Row className="mb-2">
                <Col sm={2}>Training Status:</Col>
                <Col sm={10}>
                  <LoadingField loading={trainingStatusLoading}>
                    {trainingStatus}
                  </LoadingField>
                </Col>
              </Row>
          }
          {
            !user.isAdmin &&
              <Row className="mb-2">
                <Col sm={2}>API usage:</Col>
                <Col sm={10}>
                  <LoadingField loading={initializing}>
                    <Row>
                      {
                        Object.keys(window._.get(user, ['apiUsage'], {})).map((header) =>
                          <Col key={`apiUsage_${header}`} sm={4}>
                            <div><u>{window._.startCase(header)}</u></div>
                            <div>{window._.get(user, ['apiUsage', header], 0)}</div>
                          </Col>
                        )
                      }
                    </Row>
                  </LoadingField>
                </Col>
              </Row>
          }
          <Row>
            <Col>
              <Row className="mb-2">
                <Col sm={4}>Created At:</Col>
                <Col sm={8}>
                  <LoadingField loading={initializing}>
                    { user.createdAt ? moment(user.createdAt).format(dateFormat()) : null }
                  </LoadingField>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row className="mb-2">
                <Col sm={4}>Last Login:</Col>
                <Col sm={8}>
                  <LoadingField loading={initializing}>
                    { user.lastLogin ? moment(user.lastLogin).format(dateFormat()) : null }
                  </LoadingField>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-2 d-flex justify-content-center">
            <span className="text-danger text-center">{error}</span>
          </Row>
          <div className="flex-row mt-3">
            <Button color="danger" className="mr-2" type="button" onClick={toggleConfirmModal} disabled={isSelf}>Remove User</Button>
            <Button color={success ? 'success' : 'primary'} disabled={success} loading={loading} className="float-right">
              { success ? <span><i className="fa fa-check"/> Saved</span> : 'Save' }
            </Button>
          </div>
        </Form>
      </ModalBody>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        toggleModal={toggleConfirmModal}
        onConfirm={onRemove}
        heading={`Are you sure to remove ${user.email}?`}
      />
    </Modal>
  )
};

EditUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
};

EditUserModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  accessToken: '',
};

export default EditUserModal;
