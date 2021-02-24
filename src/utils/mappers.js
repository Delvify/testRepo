import { engagements } from "./enums";

const engagementCountMapper = (datum) => {
  const count = {};
  Object.keys(engagements).forEach((key) => {
    count[engagements[key]] = datum[key];
  });
  return ({
    ...count,
  })
};

const orderMapper = (datum) => {
  const {
    oid: orderId,
    geo_location: geoLocation,
    device,
    items,
    total_value: totalValue,
    items_count: itemsCount,
    sales,
    createdAt,
  } = datum;

  return ({
    orderId,
    geoLocation,
    device,
    items,
    createdAt,
    totalValue,
    itemsCount,
    sales,
  })
};

const itemEngagementMapper = (datum) => {
  const {
    pid: productId,
    sku,
    count: {
      DISPLAY: display,
      ENLARGE: enlarge,
      CLICK: click,
      ADD_CART_FROM_WIDGET: addCartFromWidget,
      ADD_CART_FROM_DETAIL: addCartFromDetail,
      ADD_CART: addCart,
      PURCHASE: purchase,
    },
  } = datum;
  return ({
    productId,
    sku,
    engagements: {
      display: display || 0,
      enlarge: enlarge || 0,
      click: click || 0,
      addCartFromWidget: addCartFromWidget || 0,
      addCartFromDetail: addCartFromDetail || 0,
      addCart: addCart || 0,
      purchase: purchase || 0,
    }
  })
};

const productDetailMapper = (datum) => {
  const {
    id: productId,
    sku,
    name,
    description,
    image_url,
    price,
    currency: {
      sign: currencySign,
    }
  } = datum;
  return ({
    productId,
    sku,
    name,
    description,
    image_url,
    price,
    currencySign,
  });
};

const configMapper = (datum) => {
  const {
    widgets,
    addToCartButton,
    currencies,
    themedColor,
    fontSize,
    fontFamily,
    gaUtmCode,
    affiliatePrefix,
    attributes,
  } = datum;
  return ({
    widgets,
    addToCartButton,
    currencies,
    themedColor,
    fontSize,
    fontFamily,
    gaUtmCode,
    affiliatePrefix,
    attributes,
  });
};

const adminMapper = (datum) => {
  const {
    _id: id,
    username,
    role,
  } = datum;
  return ({
    id,
    username,
    role,
  });
};

const clientMapper = (datum) => {
  const {
    _id: id,
    merchantId,
    name,
    email,
    apiKey,
  } = datum;
  return ({
    id,
    merchantId,
    name,
    email,
    apiKey,
  });
};

export {
  engagementCountMapper,
  orderMapper,
  itemEngagementMapper,
  productDetailMapper,
  configMapper,
  adminMapper,
  clientMapper,
}
