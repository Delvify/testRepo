import PropTypes from "prop-types";

const ProductProptypes = PropTypes.shape({
  image_url: PropTypes.string,
  name: PropTypes.string,
  sku: PropTypes.string,
  currencySign: PropTypes.string,
  price: PropTypes.number,
  description: PropTypes.string,
});

export {
  ProductProptypes,
};
