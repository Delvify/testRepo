import React, { useCallback, useState } from 'react';
import PropTypes from "prop-types";
import {
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap";
import classNames from 'classnames';

const PasswordInput = (props) => {
  const { className, invalid, placeholder, name, autoComplete, innerRef, error } = props;
  const [isMasked, setIsMasked] = useState(true);

  const toggleMask = useCallback(() => {
    setIsMasked(!isMasked);
  }, [isMasked]);

  return (
    <InputGroup className={classNames(className)}>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <i className="icon-lock" />
        </InputGroupText>
      </InputGroupAddon>
      <Input
        invalid={invalid}
        type={isMasked ? 'password' : 'text'}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        innerRef={innerRef}
      />
      <InputGroupAddon addonType="append">
        <Button color="link" type="button" style={{ border: '1px solid #e4e7ea' }} onClick={toggleMask} tabIndex="-1">
          <i className={isMasked ? 'fa fa-eye' : 'fa fa-eye-slash' } />
        </Button>
      </InputGroupAddon>
      { error && <FormFeedback>{ error }</FormFeedback> }
    </InputGroup>
  )
};

PasswordInput.propTypes = {
  ...Input.propTypes,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default PasswordInput;
