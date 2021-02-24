export const INIT_CONFIG = {
  smartSKU: {
    heading: { enabled: true, color: '#444444', fontSize: 14, family: 'Default' },
    productName:  { enabled: true, color: '#444444', fontSize: 10, family: 'Default' },
    price:  { enabled: false, color: '#444444', fontSize: 10, family: 'Default' },
    overlay: { enabled: true, computerVision: true },
    widgets: [{
      location: 'HOME_PAGE',
      type: 'TRENDING',
      heading: 'Featured Items',
      tagId: `delvifyRecommendationTrending`,
      noOfItems: 5,
    }],
  },
  smartVision: { enabled: true }
};
