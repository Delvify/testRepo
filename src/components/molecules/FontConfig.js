import React from 'react';
import propTypes from 'prop-types';
import {Input} from "reactstrap";
import styled from "@emotion/styled";
import visibleIcon from '../../assets/img/visible.svg';
import invisibleIcon from '../../assets/img/invisible.svg';

const StyledFontConfig = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const FontFamilyConfig = styled('div')({
  width: '180px',
  marginRight: '14px'
});

const FontSizeConfig = styled('div')({
  width: '64px',
  marginRight: '19px'
});

const VisibilityButton = styled('div')({
  width: '20px',
  height: '20px',
  cursor: 'pointer'
});

const FontConfig = (props) => {
  const { onChange, config, minFontSize, maxFontSize } = props;
  return (
    <StyledFontConfig>
      <FontFamilyConfig>
        <Input
          onChange={(e) => { onChange({ family: e.target.value }) }}
          type="select"
          value={config.family}
        >
          {
            ['Default', 'Times New Roman', 'Georgia', 'Arial', 'Arial Black', 'Comic Sans MS', 'Impact', 'Tahoma', 'Trebuchet MS', 'Verdana']
              .map((key, index) => <option key={`font_${index}`} value={key}>{key}</option>)
          }
        </Input>
      </FontFamilyConfig>
      <FontSizeConfig>
        <Input
          onChange={(e) => { onChange({ fontSize: e.target.value }) }}
          type="select"
          value={config.fontSize}
        >
          {
            window._.times(maxFontSize - minFontSize + 1, (n) => n+minFontSize)
              .map((key, index) => <option key={`font_${index}`} value={key}>{key}</option>)
          }
        </Input>
      </FontSizeConfig>
      <div>
        <VisibilityButton onClick={() => {onChange({ enabled: !config.enabled })}}>
          <img alt={`${config.enabled ? 'Hidden' : 'Display'}`} src={ config.enabled ? visibleIcon : invisibleIcon } />
        </VisibilityButton>
      </div>
    </StyledFontConfig>
  )
};

FontConfig.propTypes = {
  onChange: propTypes.func.isRequired,
  config: propTypes.shape({
    enabled: propTypes.bool,
    fontSize: propTypes.oneOfType([propTypes.number, propTypes.string]),
    family: propTypes.string,
  }),
  minFontSize: propTypes.number,
  maxFontSize: propTypes.number,
};

FontConfig.defaultProps = {
  onChange: () => {},
  config: propTypes.shape({
    enabled: true,
    fontSize: 12,
    family: 'Default',
  }),
  minFontSize: 6,
  maxFontSize: 40,
};

export default FontConfig;
