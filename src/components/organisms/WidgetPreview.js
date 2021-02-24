import React, { useState, useCallback } from 'react';
import PropTypes from "prop-types";
import Slider from "react-slick";
import {Button, Col, Collapse, Row} from "reactstrap";
import productMap from '../../utils/sampleProducts';
import { color } from '../../utils/styleVariables';
import Spinner from "reactstrap/es/Spinner";

export const mapProduct = (product) => ({
  sku: product.SKU,
  name: product.Name,
  image: product.Image,
  price: product.Price,
});

const WidgetPreview = (props) => {
  const { widget, config, index, products, getCVProducts } = props;
  const { heading, noOfItems } = widget;
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [overlayProduct, setOverlayProduct] = useState({});
  const [cvProducts, setCvProducts] = useState([]);
  const sliderSettings = {
    infinite: true,
    slidesToShow: Math.min(5, noOfItems),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const toggleOverlay = useCallback(async (overlayProduct = {}) => {
    if (overlayProduct.sku) {
      setCvProducts(null);
    }
    setDisplayOverlay(!displayOverlay);
    setOverlayProduct(overlayProduct);
    if (overlayProduct.sku) {
      const products = await getCVProducts(overlayProduct.sku);
      setCvProducts(products);
    }
  }, [displayOverlay]);
  return (
    <div className="p-4">
      { config.heading.enabled && <div className="text-center font-weight-bold mb-2" style={{ fontSize: `${config.heading.fontSize}pt`, fontFamily: config.heading.family === 'Default' ? '' : config.heading.family, color: config.heading.color }}>{heading}</div> }
      <div style={{ position: 'relative' }}>
        <Slider {...sliderSettings}>
          {
            products.slice(0, noOfItems).map((product, productIndex) =>
              <div key={`widgetProduct_${index}_${productIndex}`}>
                <div style={{ position: 'relative', flexGrow: 1, height: '300px' }}>
                  <img src={product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  { config.overlay.enabled && <Button color="link" onClick={() => { toggleOverlay(product)}} type="button" className="btn-more-ctn shadow1">
                    <div className={config.overlay.computerVision ? 'icon-cv' : 'icon-bars'}/>
                  </Button> }
                </div>
                <Row>
                  { config.productName.enabled &&
                  <Col style={{ color: config.productName.color, flex: 1, fontSize: `${config.productName.fontSize}pt`, fontFamily: config.productName.family === 'Default' ? '' : config.productName.family }}>{product.name}</Col> }
                  { config.price.enabled && <Col hidden style={{ color: config.price.color, fontSize: `${config.price.fontSize}pt`, fontFamily: config.price.family === 'Default' ? '' : config.price.family, flexShrink: 0, textAlign: 'right' }}>${product.price}</Col> }
                </Row>
              </div>
            )
          }
        </Slider>
        <div className={`trans-0-5 recommended-details shadow1 ${displayOverlay && config.overlay.enabled ? '' : 'disabled'}`}>
          <div className="recommended-details-image">
            <img src={overlayProduct.image}/>
          </div>
          <div className="recommended-details-content">
            <div className="product-detail-name">{overlayProduct.name}</div>
            <div className="product-detail-price" hidden>$14.99</div>
            <div className="product-detail-description">Product Description</div>
          </div>
          {
            config.overlay.computerVision &&
              <div className='recommended-computer-vision'>
                {
                  cvProducts ?
                  [1,2].map((i) => {
                      const products = [...cvProducts, ...window._.times(6, () => overlayProduct)].slice(0, 6);
                      return <div key={`cv_row_${i}`} className="recommended-computer-vision-row">
                        {
                          [1,2,3].map((j) =>
                            <div key={`cv_block_${i}_${j}`} className="recommended-computer-vision-block shadow1">
                              <img className="recommended-computer-vision-image" src={products[i*j-1].image}/>
                              <div className="btn-more-ctn shadow1">
                                <div className='icon-cv'/>
                              </div>
                            </div>
                          )
                        }
                      </div>
                  }) :
                    [1,2].map((i) => {
                      return <div key={`cv_row_${i}`} className="recommended-computer-vision-row">
                        {
                          [1,2,3].map((j) =>
                            <div key={`cv_block_${i}_${j}`} className="recommended-computer-vision-block shadow1">
                              <Spinner size="sm" variant="secondary" />
                              <div className="btn-more-ctn shadow1">
                                <div className='icon-cv'/>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    })
                }
                <div className="recommended-computer-vision-label">Similar Looks powered by Delvify</div>
            </div>
          }
          <Button type="button" color="link" className={`recommended-details-close ${displayOverlay && config.overlay.enabled ? '' : 'd-none'}`} onClick={toggleOverlay}>
            <div className="recommended-details-close-icon" />
          </Button>
        </div>
      </div>
    </div>
  )
};


WidgetPreview.propTypes = {
  widget: PropTypes.shape({
    heading: PropTypes.string,
    noOfItems: PropTypes.number
  }),
  config: PropTypes.shape({
    heading: PropTypes.shape({
      enabled: PropTypes.bool,
      color: PropTypes.string,
      fontSize: PropTypes.number,
      family: PropTypes.string,
    }),
    productName: PropTypes.shape({
      enabled: PropTypes.bool,
      color: PropTypes.string,
      fontSize: PropTypes.number,
      family: PropTypes.string,
    }),
    price: PropTypes.shape({
      enabled: PropTypes.bool,
      color: PropTypes.string,
      fontSize: PropTypes.number,
      family: PropTypes.string,
    }),
    overlay: PropTypes.shape({
      enabled: PropTypes.bool,
      computerVision: PropTypes.bool,
      fontSize: PropTypes.number,
      family: PropTypes.string,
    }),
  }),
  index: PropTypes.number,
  products: PropTypes.arrayOf(PropTypes.shape({
    sku: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  cvProducts: PropTypes.arrayOf(PropTypes.shape({
    sku: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  getCVProducts: PropTypes.func,
};

WidgetPreview.defaultProps = {
  index: 0,
  products: productMap,
  getCVProducts: () => {},
  config: {
    heading: {
      enabled: true,
      color: '#000',
      fontSize: 29,
      family: 'Default',
    },
    productName: {
      enabled: true,
      color: '#000',
      fontSize: 10,
      family: 'Default',
    },
    price: {
      enabled: true,
      color: '#000',
      fontSize: 10,
      family: 'Default',
    },
    overlay: { enabled: true, computerVision: true },
  },
  widget: PropTypes.shape({
    heading: '',
    noOfItems: 5
  }),
};

export default WidgetPreview;
