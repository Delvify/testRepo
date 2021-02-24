import * as React from 'react';
import styled from '@emotion/styled';
import { color } from '../../utils/styleVariables';
import productMap, { loadingImages } from '../../utils/sampleProducts';
import backgroundImage from '../../assets/img/ecommerce_background.png';
import propTypes from "prop-types";
import {useRef} from "react";
import {useCallback} from "react";

const StyledBackground = styled('div')({
    backgroundColor: color.background.popup,
    backgroundImage: `linear-gradient(${color.background.popup}, ${color.background.popup}), url(${backgroundImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    marginRight: '3.3%',
    padding: '3.1%',
    marginTop: '20px',
    height: '80%',
});

const StyledContent = styled('div')(
  {
    backgroundColor: color.background.content,
    position: 'relative',
    height: '40vw',
    display: 'flex',
    flexDirection: 'row',
  },
  ({ color }) => ({
    color: color,
  })
);

const StyledUploadWrapper = styled.div`
  flex: 0 1 33%;
  display: flex;
  flex-direction: column;
  padding: 36px 8% 36px 8%;
  align-items: center;
`;

const StyledDivider = styled.div`
   width: 3.4px;
   background-color: #e7e7e7;
`;

const StyledResultWrapper = styled.div`
   overflow-y:  scroll;
   padding: 36px 0 5vh 8%;
   flex: 1
`;

const StyledHeader = styled('div')(
  {
    fontWeight: 500,
    marginBottom: '56px',
  },
  ({ config }) => ({
    fontFamily: config.family === 'Default' ? 'Keep Calm' : config.family,
    fontSize: `calc(0.045vw * ${config.fontSize})`,
  })
);

const StyledUploadedImage = styled.img`
   width: 100%;
   max-height: 20vh;
   object-fit: contain;
`;

const StyledUploadedButton = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   padding: 5px;
   margin-top: 33.6px;
   cursor: pointer;
`;

const StyledUploadedButtonText = styled('div')(
  {
    fontWeight: 500,
    fontSize: `calc(0.043vw * 15)`,
    marginLeft: 'calc(0.045vw * 14)',
  },
  ({ config }) => ({
    fontFamily: config.family === 'Default' ? 'Keep Calm' : config.family,
    fontSize: `calc(0.043vw * ${config.fontSize})`,
  })
);

const StyledResultContent = styled.div`
   display: flex;
   flex-direction: row;
   flex-wrap: wrap
`;

const StyledResultBlock = styled.div`
   width: 115px;
   margin-bottom: 52.6px;
   margin-right: 7%;
   cursor: pointer;
`;

const StyledResultBlockImage = styled.img`
   width: 100%;
   object-fit: cover;
`;

const StyledResultBlockDescription = styled.div`
   font-family: Montserrat-Regular, sans-serif;
   font-size: 9.43px;
   line-height: 12px;
   margin-top: 23px;
`;


const StyledResultBlockPrice = styled.div`
   margin-top: 7.6px;
   font-family: Keep Calm;
   font-weight: bold;
   font-size: 9.43px;
   line-height: 12px;
`;

const StyledCloseButton = styled.div`
    position: absolute;
    top: 0;
    margin: 14px;
    padding: 5px;
    cursor: pointer;
`;

const Content = ({ className, config, onFileUpload, onClose, image, result, loading }) => {
  const { headerText, uploadText } = config;
  const uploadInput = useRef(null);

  const handleUploadButtonClick = useCallback(() => {
    uploadInput.current.click();
  }, [uploadInput]);

  const handleFileUpload = useCallback((e, r) => {
    const file = e.target.files[0];
    onFileUpload(file);
  }, []);

  return (
    <StyledContent color={headerText.color} className={className}>
      <StyledUploadWrapper>
        { headerText.enabled && <StyledHeader config={headerText}>Your Upload</StyledHeader> }
        <StyledUploadedImage src={image || productMap[9].image}/>
        {
          uploadText.enabled &&
          <StyledUploadedButton onClick={onFileUpload ? handleUploadButtonClick : () => {}}>
            <img
              src="https://delvify-recommendations-vendors.s3-ap-southeast-1.amazonaws.com/camera-solid.svg"
              width={19}
            />
            <StyledUploadedButtonText config={uploadText}>Upload another image</StyledUploadedButtonText>
          </StyledUploadedButton>
        }
      </StyledUploadWrapper>
      <StyledDivider />
      <StyledResultWrapper className="delvify-smart-vision-panel-result">
        { headerText.enabled && <StyledHeader config={headerText}>Similar items</StyledHeader> }
        <StyledResultContent>
          {
            loading ?
              loadingImages.map((image, index) =>
                <StyledResultBlock key={`loading_image_${index}`} className="image-loading">
                  <StyledResultBlockImage src={image}/>
                </StyledResultBlock>) :
              (result || productMap.slice(0, 8)).map((product) =>
                <StyledResultBlock key={`product_result_${product.name}`}>
                  <StyledResultBlockImage src={product.image}/>
                  <StyledResultBlockDescription>{product.name}</StyledResultBlockDescription>
                  <StyledResultBlockPrice>${product.price}</StyledResultBlockPrice>
                </StyledResultBlock>)
          }
        </StyledResultContent>
      </StyledResultWrapper>
      <StyledCloseButton onClick={onClose}>
        <img
          src="https://delvify-recommendations-vendors.s3-ap-southeast-1.amazonaws.com/close_small.svg"
          width={13.4}
        />
      </StyledCloseButton>
      <input type='file' accept="image/*" id="uploadInput" onChange={handleFileUpload} ref={uploadInput} hidden/>
    </StyledContent>
  )
};

const SmartVisionResultPreview = ({ className, noBackground, ...props }) => {
  return (
    noBackground ?
      <Content className={className} {...props} /> :
      <StyledBackground className={className}>
        <Content {...props} />
      </StyledBackground>
  )
};

SmartVisionResultPreview.protoTypes = {
  config: propTypes.shape({
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
  }),
  noBackground: propTypes.bool,
  onFileUpload: propTypes.func,
  onClose: propTypes.func,
  image: propTypes.object,
  result: propTypes.arrayOf(propTypes.shape({
    sku: propTypes.string,
    name: propTypes.string,
    image: propTypes.string,
    price: propTypes.oneOfType([propTypes.number, propTypes.string]),
  })),
  loading: propTypes.bool,
};

SmartVisionResultPreview.defaultProps = {
  config: {
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
  },
  noBackground: false,
  onClose: () => {},
};

export default SmartVisionResultPreview;
