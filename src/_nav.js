export default {
  items: [
    {
      title: true,
      name: 'Smart Platform',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    // {
    //   name: 'Overview',
    //   url: '/overview',
    //   icon: 'icon-pie-chart',
    // },
    // {
    //   name: 'Campaign Report',
    //   url: '/campaigns',
    //   icon: 'icon-chart',
    // },
    // {
    //   name: 'Conversion Report',
    //   url: '/conversions',
    //   icon: 'icon-wallet',
    // },
    {
      name: 'Onboarding',
      url: '/onboarding',
      icon: 'icon-control-play',
    },
    {
      name: 'Upload Product Feed',
      url: '/upload',
      icon: 'icon-cloud-upload',
    },
    {
      name: 'AI Solutions',
      icon: 'icon-settings',
      children: [
        {
          name: 'Smart SKU',
          url: '/config/smart-sku',
        },
        {
          name: 'Smart Vision',
          url: '/config/smart-vision',
        }
      ]
    },
    {
      name: 'Test Area',
      icon: 'icon-game-controller',
      children: [
        {
          name: 'Smart SKU',
          url: '/test/smart-sku',
        },
        {
          name: 'Smart Vision',
          url: '/test/smart-vision',
        }
      ]
    },
    {
      name: 'Deploy',
      url: '/deploy',
      icon: 'icon-paper-plane',
    },
  ],
};
