import React, {useCallback, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import Overview from "../Overview";
import {Card, CardHeader, Jumbotron, CardBody, Row, Col} from "reactstrap";
import {Divider, Button} from "../../components/atoms";
import { Link } from 'react-router-dom';
import {API, graphqlOperation} from "aws-amplify";
import moment from 'moment';

import * as queries from "../../graphql/queries";
import {Table, NewUserModel, EditUserModal, Pagination} from "../../components/organisms";
import {dateFormat} from '../../utils/stringHelper';
import {usePagination} from "../../components/hooks";
import {orderMapper} from "../../utils/mappers";

const FETCH_LIMIT = 50;

const mapStateToProps = (state) => ({
  accessToken: window._.get(state, ['auth', 'user', 'signInUserSession', 'accessToken', 'jwtToken'], null),
  username: window._.get(state, ['auth', 'user', 'username'], null),
});

const Users = (props) => {
  const { accessToken, username } = props;
  const [totalPage, setTotalPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editUserID, setEditUserID] = useState(null);
  const [fetchToken, setFetchToken] = useState(null);

  const { page, goToPage } = usePagination(props);

  useEffect(() => {
    getTotal();
  }, []);

  useEffect(() => {
    getUsers();
  }, [page]);

  const onUpdated = useCallback(() => {
    getTotal();
    getUsers();
  }, []);

  const toggleNewUserModal = useCallback(() => {
    setNewUserModalOpen(!newUserModalOpen);
  }, [newUserModalOpen]);

  const getTotal = useCallback(async () => {
    let myInit = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: accessToken
      }
    };
    try {
      const { total } = await API.get('AdminQueries', '/totalUsers', myInit);
      setTotalPage(Math.ceil(total/FETCH_LIMIT));
    } catch (e) {
      console.log(e);
    }
  }, []);

  const toggleEditUserModal = useCallback(async (userID) => {
    setEditUserID(userID);
    setEditUserModalOpen(!editUserModalOpen);
  }, [editUserModalOpen]);

  const getUsers = useCallback(async () => {
    setLoading(true);
    let myInit = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: accessToken
      },
      queryStringParameters: {  // OPTIONAL
        limit: FETCH_LIMIT,
        token: fetchToken,
      },
    };
    try {
      const result = await API.get('AdminQueries', '/listUsers', myInit);
      const { items, lastToken } = result;
      const usersContent = items.map((item) => window._.pick(item, ['id', 'name', 'email', 'isConfirmed', 'isAdmin', 'lastLogin']));
      const users = usersContent.map((user) => ({
          id: user.id,
          rowContent: {
            name: <span>{ user.name }{ user.isAdmin && <i className="fa verified text-primary"/>}</span>,
            email: user.email,
            isConfirmed: <i className={`fa ${user.isConfirmed ? 'fa-check-circle' : 'fa-times'} text-${user.isConfirmed ? 'success' : 'danger'}`}/>,
            lastLogin: user.lastLogin ? moment(user.lastLogin).format(dateFormat()) : null,
          },
      }));
      const headers = [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'isConfirmed', label: 'Email Verified?' },
        { id: 'lastLogin', label: 'Last Login' },
      ];
      setUsers(users);
      setHeaders(headers);
      setFetchToken(lastToken);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [fetchToken]);

  return (
    <div className="animated fadeIn">
      <Button type="button" color="primary" className="mb-2 float-right" onClick={toggleNewUserModal}><i className="fa fa-plus-circle" /> New User</Button>
      <Table
        loading={loading}
        headers={headers}
        items={users}
        onRowClick={toggleEditUserModal}
      />
      {/*<Pagination page={page} totalPage={totalPage} goToPage={goToPage} />*/}
      <NewUserModel isOpen={newUserModalOpen} onClose={toggleNewUserModal} accessToken={accessToken} onUpdated={onUpdated}/>
      <EditUserModal isOpen={editUserModalOpen} onClose={toggleEditUserModal} accessToken={accessToken} userID={editUserID} onUpdated={onUpdated} isSelf={username === editUserID}/>
    </div>
  )
};

export default connect(mapStateToProps)(Users);
