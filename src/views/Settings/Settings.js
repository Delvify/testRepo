import React, { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  FormGroup,
  Label, Modal, ModalBody, ModalFooter, ModalHeader,
  Row,
  Input,
  Form,
} from 'reactstrap';
import { connect } from 'react-redux';
import { useForm } from "../../components/hooks";
import {adminMapper} from "../../utils/mappers";
import {ROLE} from "../../utils/enums";
import {updateClient} from "../../actions/authAction";

const mapStateToProps = (state) => ({
  me: window._.get(state, ['auth', 'admin'], {}),
  client: window._.get(state, ['auth', 'client'], {}),
});
const mapDispatchToProps = {
  updateClient,
};

const Settings = (props) => {
  const { me, client, updateClient } = props;
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminModalError, setAdminModalError] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [companyInfo, setCompanyInfo] = useState([]);

  useEffect(() => {
    setCompanyInfo(client);
  }, [client]);

  const toggleAdminModal = useCallback(() => {
    setAdminModalOpen(!adminModalOpen);
    setAdminModalError(null);
  }, [adminModalOpen]);

  const validator = useCallback((name, value) => {
    switch (name) {
      case 'username': return window._.isEmpty(value) ? 'Username required' : null;
      case 'password':
      case 'newPassword':
      case 'confirmPassword':
        return window._.isEmpty(value) ? 'Required' : null;
    }
  }, []);

  const onSubmitPassword = useCallback((values, errors) => {
    console.log('password', values, errors);
  }, []);

  const onAdminDelete = useCallback((values) => {
    const ids = values.admins;
    if (window._.isEmpty(ids)) return;
    window.api.delete('admin', { ids })
      .then(() => {
        setAdmins(window._.filter(admins, (admin) => !ids.includes(admin.id)));
      })
      .catch(console.log);
    console.log(values);
  }, [admins]);

  const onAddAdmin = useCallback((values) => {
    const { username, password } = values;
    if (values.password !== values.confirmPassword) {
      return setAdminModalError('Password not match');
    }
    window.api.post('admin',{ username, password, createdBy: me.id })
      .then((res) => {
        setAdmins([...admins, adminMapper(res)]);
        setAdminModalOpen(false);
      })
      .catch((e) => {
        setAdminModalError(e.message);
      });
  }, [admins, me]);

  const onEditCompany = useCallback((values) => {
    const { name, email, contactNumber, billingAddress, billingEmail } = values;

    window.api.post('/master/client',{ name, email, contactNumber, billingAddress, billingEmail })
      .then((res) => {
        updateClient();
      })
      .catch((e) => {
        setAdminModalError(e.message);
      });
  }, []);

  const { values: valuesPassword, errors: errorsPassword, handleChange: handleChangePassword, handleSubmit: handleSubmitPassword } = useForm({ onSubmit: onSubmitPassword, validator });
  const { values: valuesDeleteAdmins, errors: errorsDeleteAdmins, handleChange: handleChangeDeleteAdmins, handleSubmit: handleSubmitDeleteAdmins } = useForm({ onSubmit: onAdminDelete, validator });
  const { values: valuesAdmin, errors: errorsAdmin, handleChange: handleChangeAdmin, handleSubmit: handleSubmitAdmin } = useForm({ onSubmit: onAddAdmin, validator });
  const { values: valuesCompany, errors: errorsCompany, handleChange: handleChangeCompany, handleSubmit: handleSubmitCompany } = useForm({ onSubmit: onEditCompany, validator, initialValues: companyInfo });

  useEffect(() => {
    window.api.get('admin')
      .then((res) => {
        setAdmins(res.map(adminMapper).filter((admin) => admin.role !== ROLE.ROOT));
      })
      .catch(console.log);
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="6">
          <Form onSubmit={handleSubmitCompany}>
            <Card>
              <CardHeader>
                <strong>Company Info</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row>
                  <Col md="3"><Label htmlFor="billingEmail">Merchant Id</Label></Col>
                  <Col md="9"><Input size="16" type="text" name={'merchantId'} disabled defaultValue={companyInfo.merchantId} /></Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3"><Label htmlFor="billingEmail">API_KEY</Label></Col>
                  <Col md="9"><Input size="16" type="text" name={'apiKey'} disabled defaultValue={companyInfo.apiKey} /></Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3"><Label htmlFor="companyName">Company Name</Label></Col>
                  <Col md="9"><Input size="16" type="text" name={'name'} onChange={handleChangeCompany} defaultValue={companyInfo.name}/></Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3"><Label htmlFor="email">Email Address</Label></Col>
                  <Col md="9"><Input size="16" type="email" name={'email'} onChange={handleChangeCompany} defaultValue={companyInfo.email}/></Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3"><Label htmlFor="contactNumber">Contact Number</Label></Col>
                  <Col md="9"><Input size="16" type="tel" name={'contactNumber'} onChange={handleChangeCompany} defaultValue={companyInfo.contactNumber}/></Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3"><Label htmlFor="billingAddress">Billing Address</Label></Col>
                  <Col md="9"><Input size="16" type="text" name={'billingAddress'} onChange={handleChangeCompany} defaultValue={companyInfo.billingAddress}/></Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3"><Label htmlFor="billingEmail">Billing Email</Label></Col>
                  <Col md="9"><Input size="16" type="email" name={'billingEmail'} onChange={handleChangeCompany} defaultValue={companyInfo.billingEmail}/></Col>
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" className="float-right"><i className="fa fa-dot-circle-o" /> Save</Button>
              </CardFooter>
            </Card>
          </Form>
        </Col>
        <Col xs="12" sm="6">
          <Form onSubmit={handleSubmitDeleteAdmins}>
            <Card>
              <CardHeader>
                <strong>Admins</strong>
              </CardHeader>
              <CardBody>
                <Input type="select" name="admins" id="admins" multiple onChange={handleChangeDeleteAdmins}>
                  {
                    admins.map((admin) => {
                      return (
                        <option value={admin.id} key={`admin_${admin.id}`} disabled={me.id === admin.id}>
                          {admin.username}{me.id === admin.id ? ' (You)' : ''}
                        </option>
                      );
                    })
                  }
                </Input>
              </CardBody>
              <CardFooter>
                <Button size="sm" color="primary" className="float-right" onClick={toggleAdminModal}><i className="fa fa-user-plus" /> Add Admin</Button>
                <Button type="submit" size="sm" color="danger" className="float-right mr-2"><i className="fa fa-user-times" /> Remove</Button>
              </CardFooter>
            </Card>
          </Form>
          <Modal isOpen={adminModalOpen} toggle={toggleAdminModal}>
            <Form onSubmit={handleSubmitAdmin}>
              <ModalHeader toggle={toggleAdminModal}>Add admin</ModalHeader>
              <ModalBody>
                <FormGroup row>
                  <Col md="12">
                    <FormGroup row>
                      <Col md="3"><Label>Username</Label></Col>
                      <Col md="8"><Input size="16" name="username" type="text" onChange={handleChangeAdmin}/></Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3"><Label>Password</Label></Col>
                      <Col md="8"><Input size="16" name="password" type="password" onChange={handleChangeAdmin}/></Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3"><Label>Confirm password</Label></Col>
                      <Col md="8"><Input size="16" name="confirmPassword" type="password" onChange={handleChangeAdmin}/></Col>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <Row className="d-flex justify-content-center">
                  <span className="text-danger text-center">{adminModalError}</span>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" disabled={!valuesAdmin.username || !valuesAdmin.password || !valuesAdmin.confirmPassword}>Save</Button>
              </ModalFooter>
            </Form>
          </Modal>
        </Col>

      </Row>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
