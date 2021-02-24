import React, { useState, useCallback, useRef } from "react";
import PropTypes from 'prop-types';
import Header from "../atoms/Header";
import Button from "../atoms/Button";
import {Form} from "reactstrap";
import styled from "@emotion/styled";
import {color} from "../../utils/styleVariables";

const COPY_STATUS = {
  IDLE: 'COPY_STATUS_IDLE',
  SUCCESS: 'COPY_STATUS_SUCCESS',
};

const AppendixWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '&>div': {
    marginRight: '17px',
    color: color.text.secondary,
  },
  marginTop: '13.5px',
});

const CodeSnippet = (props) => {
  const { children, rows, title, prepend, className, append, type } = props;
  const [copyStatus, setCopyStatus] = useState(COPY_STATUS.IDLE);
  const scriptRef = useRef(null);
  const onCopyScriptClick = useCallback(() => {
    scriptRef.current.select();
    document.execCommand("copy");
    setCopyStatus(COPY_STATUS.SUCCESS);
  }, [scriptRef]);

  return (
    <div className={`${className}`}>
      <Header
        size={type === 'main' ? 'lg' : 'default'}
        title={title}
        Button={
          type !== 'partial' ? <Button onClick={onCopyScriptClick} aria-label="Copy">
            { copyStatus === COPY_STATUS.IDLE ? 'Copy' : 'Copied!' }
          </Button> : null
        }
      >
        {prepend}
      </Header>
      <Form className="text-monospace script-tag w-100">
          <textarea
            onBlur={() => { setCopyStatus(COPY_STATUS.IDLE); }}
            readOnly
            rows={rows || 2}
            className="w-100 border-0 text-monospace text-dark p-0 bg-transparent"
            style={{ resize: 'none' }}
            ref={scriptRef}
            value={children}
          />
      </Form>
      <AppendixWrapper>
        <div>{append}</div>
        {type === 'partial' && <Button onClick={onCopyScriptClick}>
          { copyStatus === COPY_STATUS.IDLE ? 'Copy' : 'Copied!' }
        </Button>}
      </AppendixWrapper>
    </div>
  )
};

CodeSnippet.propTypes = {
  rows: PropTypes.number,
  title: PropTypes.string,
  prepend: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  append: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  type: PropTypes.oneOf(['default', 'main', 'partial']),
};

CodeSnippet.defaultProps = {
  rows: 1,
  type: 'default',
};

export default CodeSnippet;
