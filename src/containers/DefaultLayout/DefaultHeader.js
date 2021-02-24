import React, { useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import { connect } from 'react-redux';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { logoutUser } from "../../actions/authAction";
import logo from '../../assets/img/brand/logo.svg'
import logo_small from '../../assets/img/brand/logo_small.svg'
import moment from "moment-timezone";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  logoutUser,
};

const DefaultHeader = (props) => {
  const { logoutUser, auth } = props;

  const logout = useCallback(() => {
    logoutUser();
  }, []);

  const helpCenter = useCallback(() => {
    window.open("https://docs.delvify.io", "_blank")
  }, []);

  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand
        full={{ src: logo, width: 89, height: 25, alt: 'Delvify' }}
        minimized={{ src: logo_small, width: 30, height: 30, alt: 'Delvify' }}
      />
      <AppSidebarToggler className="d-md-down-none" display="lg" />
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav direction="down" className="mr-5">
          <DropdownToggle nav className="text-right">
            <span>{ window._.get(auth, ['user', 'attributes', 'name'], null) } </span><br/>
            <span>{ window._.get(auth, ['user', 'attributes', 'email'], null) } <i className="fa fa-user" /></span>
          </DropdownToggle>
          <DropdownMenu right style={{ right: 'auto' }}>
            <DropdownItem onClick={helpCenter}><i className="fa fa-wrench" /> Help Center</DropdownItem>
            <DropdownItem onClick={logout}><i className="fa fa-lock" /> Logout</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader);
