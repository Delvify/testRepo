import React, { useState, useCallback, useRef } from 'react';
import propTypes from 'prop-types';

import CardTitle from "../atoms/CardTitle";
import Button from "../atoms/Button";
import Header from "../atoms/Header";
import SearchBarPreview from "../molecules/SearchBarPreview";
import IconPreview from "../molecules/IconPreview";
import Card from "../layouts/Card";
import styled from "@emotion/styled";

const statuses = {
  INITIAL: 'INITIAL',
  CHANGING: 'CHANGING',
  LOADING: 'LOADING',
  SAVED: 'SAVED',
};

const defultIcons = [
  'https://delvify-recommendations-vendors.s3-ap-southeast-1.amazonaws.com/smart_vision_icon_1.svg',
  'https://delvify-recommendations-vendors.s3-ap-southeast-1.amazonaws.com/smart_vision_icon_2.svg',
];

const IconPreviewWrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '1.5rem',
});

const SmartVisionIconConfiguration = (props) => {
  const { buttonIconUrl, buttonIcons, onSave, onFileUpload, onRemove } = props;
  const [buttonIcon, setButtonIcon] = useState(null);
  const [status, setStatus] = useState(statuses.INITIAL);
  const uploadInput = useRef(null);

  const onIconSelected = useCallback((icon) => {
    setButtonIcon(icon);
  }, []);

  const onSaveIcon = useCallback(async () => {
    setStatus(statuses.LOADING);
    await onSave(buttonIcon || buttonIconUrl);
    setStatus(statuses.SAVED);
  }, [onSave, buttonIcon]);

  const onRemoveIcon = useCallback(async (icon) => {
    onRemove(icon);
    if (icon === buttonIcon || icon === buttonIconUrl) {
      onIconSelected(defultIcons[0]);
      if (icon === buttonIconUrl) {
        setStatus(statuses.LOADING);
        if (icon === buttonIconUrl) await onSave(defultIcons[0]);
        setStatus(statuses.SAVED);
      }
    }
  }, [onRemove, onSave, buttonIcon]);

  const handleFileUpload = useCallback((e, r) => {
    const file = e.target.files[0];
    onFileUpload(file);
  }, [onFileUpload]);

  const handleUploadButtonClick = useCallback(() => {
    uploadInput.current.click();
  }, [uploadInput]);

  return (
    <Card>
      <CardTitle
        Button={
          <Button type="button" onClick={onSaveIcon} color={status === statuses.SAVED ? 'success' : 'primary'} loading={status === statuses.LOADING}>
            <span>{ status === statuses.SAVED && <i className="fa fa-check" /> }</span>
            <span>{ status === statuses.SAVED ? ' Saved' : ' Save' }</span>
          </Button>
        }
      >
        Icon Configuration
      </CardTitle>
      <Header title="Customize Icon">
        Choose or upload your custom PNG file for the Search Bar Icon. Picture size should be minimum 30 x 30 pixels and file size under 4 MB.
      </Header>
      <IconPreviewWrapper>
        {
          defultIcons.map((icon, index) =>
            <IconPreview className="mr-4" key={`default_button_icon_${index}`} icon={icon} onClick={() => onIconSelected(icon)} selected={(buttonIcon || buttonIconUrl) === icon}/>
          )
        }
        {
          buttonIcons.map((icon, index) =>
            <IconPreview
              className="mr-4"
              key={`button_icon_${index}`}
              icon={icon}
              onClick={() => onIconSelected(icon)}
              selected={(buttonIcon || buttonIconUrl) === icon}
              onRemove={() => onRemoveIcon(icon)}
            />
          )
        }
        <IconPreview type="upload" onClick={handleUploadButtonClick} />
        <input type='file' accept="image/*" id="uploadInput" onChange={handleFileUpload} ref={uploadInput} hidden/>
      </IconPreviewWrapper>
      <Header title="Preview">
        This is what SMART Vision currently looks like, once your users click on the Search Bar Icon and uploads an image.
      </Header>
      <SearchBarPreview className="mt-3 mb-4" icon={buttonIcon || buttonIconUrl} />
    </Card>
  )
};

SmartVisionIconConfiguration.propType = {
  buttonIconUrl: propTypes.string,
  buttonIcons: propTypes.arrayOf(propTypes.string),
  onSave: propTypes.func,
  onRemove: propTypes.func,
  onFileUpload: propTypes.func,
};

SmartVisionIconConfiguration.defaultProps = {
  onSave: () => {},
  onIconRemove: () => {},
  onFileUpload: () => {},
};

export default SmartVisionIconConfiguration;
