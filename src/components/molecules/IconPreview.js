import React from 'react';
import styled from '@emotion/styled';
import propTypes from 'prop-types';
import {color} from '../../utils/styleVariables';
import uploadIcon from '../../assets/img/smart_vision_upload.svg';
import removeIcon from '../../assets/img/minus.svg';

const StyledIconPreview = styled('div')({
  textAlign: 'center',
  width: '75px',
  position: 'relative',
});

const IconButton = styled('div')(
  {
    width: '75px',
    height: '75px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderStyle: 'solid',
    borderRadius: '10px',
    '&>img': {
      width: '30px',
      height: '30px',
      objectFit: 'contain',
    }
  },
  prop => ({
    backgroundColor: prop.type === 'upload' ? '#E5E5E5' : prop.selected ? color.background.selected : '#ffffff',
    borderColor: prop.type === 'upload' ? '#EFEFF0' : prop.selected ? color.border.selected : '#E5E5E5',
    borderWidth: prop.selected ? '2px' : '1px',
  })
);

const Badge = styled('div')({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#E5E5E5',
  padding: '5px',
  borderRadius: '50%',
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  cursor: 'pointer',
  '&>img': {
    width: '100%',
    height: '100%',
  }
});

const Label = styled('div')(
  { marginTop: '11px', fontSize: '12px' },
  prop => ({
    color: prop.selected ? color.text.active : color.text.label,
  })
);

const IconPreview = ({ className, icon, selected, type, onClick, onRemove }) => {
  return (
    <StyledIconPreview className={className} selected>
      <IconButton selected={selected} type={type} onClick={onClick}>
        <img src={type === 'upload' ? uploadIcon : icon } />
      </IconButton>
      { onRemove && <Badge onClick={onRemove}><img src={removeIcon} /></Badge> }
      { (selected || type === 'upload') ? <Label selected={selected}>{ type === 'upload' ? 'Upload Your Custom Icon' : 'Current Icon' }</Label> : null }
    </StyledIconPreview>
  )
};

IconPreview.prototype = {
  icon: propTypes.string,
  selected: propTypes.bool,
  type: propTypes.oneOf(['default', 'upload']),
  onClick: propTypes.func.require,
  onRemove: propTypes.func,
  label: propTypes.string,
};

IconPreview.default = {
  type: 'default',
};

export default IconPreview;
