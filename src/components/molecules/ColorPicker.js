import React, {useCallback, useState} from 'react';
import {PopoverBody, UncontrolledPopover} from "reactstrap";
import {SketchPicker} from "react-color";
import styled from "@emotion/styled";
import { color } from '../../utils/styleVariables';
import PropTypes from "prop-types";

const StyledColorPicker = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const ColorButton = styled('div')(
  {
    width: '22px',
    height: '22px',
    borderRadius: 5,
    border: 'solid 1px #C4C4C4',
    backgroundColor: '#000000',
    cursor: 'pointer'
  },
  props => ({
    backgroundColor: props.color || '#000000',
  })
);

const Label = styled('div')({
  color: color.text.secondary,
  marginLeft: '9px',
});

const ColorPicker = (props) => {
  const { id, color, onChange } = props;

  return (
    <StyledColorPicker>
      <ColorButton id={id} color={color}/>
      <Label>{color}</Label>
      <UncontrolledPopover placement="right" target={id} trigger="legacy">
        <PopoverBody><SketchPicker color={color} onChange={(color) => { onChange(color.hex); }} /></PopoverBody>
      </UncontrolledPopover>
    </StyledColorPicker>
  )
};

ColorPicker.protoTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ColorPicker;
