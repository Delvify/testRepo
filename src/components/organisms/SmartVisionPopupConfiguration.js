import React, { useState, useCallback } from 'react';
import propTypes from 'prop-types';
import CardTitle from "../atoms/CardTitle";
import Button from "../atoms/Button";
import Header from "../atoms/Header";
import SmartVisionResultPreview from "./SmartVisionResultPreview";
import Card from "../layouts/Card";
import {Col, Label, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import {SketchPicker} from "react-color";
import ColorPicker from "../molecules/ColorPicker";
import FontConfig from "../molecules/FontConfig";
import SmartVisionIconConfiguration from "./SmartVisionIconConfiguration";
import styled from "@emotion/styled";

const statuses = {
  INITIAL: 'INITIAL',
  CHANGING: 'CHANGING',
  LOADING: 'LOADING',
  SAVED: 'SAVED',
};

const ConfigWrapper = styled('div')({
  display: 'flex',
  columnGap: '20px',
});

const SmartVisionPopupConfiguration = (props) => {
  const { fontConfig, onSave } = props;
  const [fontConfigTemp, setFontConfigTemp] = useState(null);
  const [status, setStatus] = useState(statuses.INITIAL);

  const onSavePopup = useCallback(async () => {
    setStatus(statuses.LOADING);
    await onSave(fontConfigTemp);
    setStatus(statuses.SAVED);
  }, [onSave, fontConfigTemp]);

  const onTextChange = useCallback((type, delta) => {
    const temp = fontConfigTemp || fontConfig;
    setFontConfigTemp({
      ...temp,
      [type]: {
        ...temp[type],
        ...delta,
      }
    });
  }, [fontConfigTemp]);

  return (
    <Card>
      <CardTitle
        Button={
          <Button type="button" onClick={onSavePopup} color={status === statuses.SAVED ? 'success' : 'primary'} loading={status === statuses.LOADING}>
            <span>{ status === statuses.SAVED && <i className="fa fa-check" /> }</span>
            <span>{ status === statuses.SAVED ? ' Saved' : ' Save' }</span>
          </Button>
        }
      >
        Upload Result Window
      </CardTitle>
      <Header title="Text in Image Results Window " className="mt-5">Customize font size, color, family to your website brand and style.</Header>
      <Row>
        <Col sm={3}>
          <Header title="Color">
            <ColorPicker
              id='fonColor'
              color={fontConfigTemp ? fontConfigTemp.headerText.color : fontConfig.headerText.color}
              onChange={(color) => { onTextChange('headerText', { color })}}
            />
          </Header>
        </Col>
        <Col>
          <Header title="Header Font">
            <FontConfig
              config={fontConfigTemp ? fontConfigTemp.headerText : fontConfig.headerText}
              onChange={(delta) => { onTextChange('headerText', delta) }}
            />
          </Header>
        </Col>
        <Col>
          <Header title="'Upload' Font">
            <FontConfig
              config={fontConfigTemp ? fontConfigTemp.uploadText : fontConfig.uploadText}
              onChange={(delta) => { onTextChange('uploadText', delta) }}
              maxFontSize={30}
            />
          </Header>
        </Col>
      </Row>
      <Header title="Preview">
        This is what SMART Vision currently looks like, once your users click on the Search Bar Icon and uploads an image.
      </Header>
      <SmartVisionResultPreview config={fontConfigTemp || fontConfig}/>
    </Card>
  )
};

SmartVisionPopupConfiguration.propType = {
  fontConfig: propTypes.shape({
    headerText: propTypes.shape({
      enabled: propTypes.bool,
      color: propTypes.string,
      fontSize: propTypes.oneOfType([propTypes.number, propTypes.string]),
      family: propTypes.string,
    }),
    uploadText: propTypes.shape({
      enabled: propTypes.bool,
      color: propTypes.string,
      fontSize: propTypes.oneOfType([propTypes.number, propTypes.string]),
      family: propTypes.string,
    }),
  })
};

SmartVisionPopupConfiguration.defaultProps = {
  fontConfig: {
    headerText: {
      enabled: true,
      color: '#000000',
      fontSize: 30,
      family: 'Default',
    },
    uploadText: {
      enabled: true,
      color: '#000000',
      fontSize: 15,
      family: 'Default',
    },
  }
};

export default SmartVisionPopupConfiguration;
