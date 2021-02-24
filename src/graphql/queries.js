/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProducts = /* GraphQL */ `
  query GetProducts($userID: String!, $SKU: String!) {
    getProducts(userID: $userID, SKU: $SKU) {
      userID
      SKU
      Name
      Category
      Description
      OriginalUrl
      Image
      Price
      Currency
      Brand
    }
  }
`;
export const listProductss = /* GraphQL */ `
  query ListProductss {
    listProductss {
      userID
      SKU
      Name
      Category
      Description
      OriginalUrl
      Image
      Price
      Currency
      Brand
    }
  }
`;
export const getEngagements = /* GraphQL */ `
  query GetEngagements($id: Int!) {
    getEngagements(id: $id) {
      id
      userID
      SKU
      location
      type
      source
      geo_location
      device
      sessionID
      computerVision
      createdAt
      key
    }
  }
`;
export const listEngagementss = /* GraphQL */ `
  query ListEngagementss {
    listEngagementss {
      id
      userID
      SKU
      location
      type
      source
      geo_location
      device
      sessionID
      computerVision
      createdAt
      key
    }
  }
`;
export const getOrders = /* GraphQL */ `
  query GetOrders($id: Int!) {
    getOrders(id: $id) {
      id
      SKU
      Price
      Currency
      quantity
      engagementID
    }
  }
`;
export const listOrderss = /* GraphQL */ `
  query ListOrderss {
    listOrderss {
      id
      SKU
      Price
      Currency
      quantity
      engagementID
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      name
      attributes {
        SKU
        Name
        Category
        Description
        OriginalUrl
        Image
        Price
        Currency
        Brand
        lastUpdate
      }
      trainingStatus
      config {
        widgets {
          location
          type
          heading
          noOfItems
          tagId
        }
        heading {
          enabled
          color
          fontSize
          family
        }
        productName {
          enabled
          color
          fontSize
          family
        }
        price {
          enabled
          color
          fontSize
          family
        }
        overlay {
          enabled
          computerVision
        }
      }
      apiUsage {
        uploadCatalog
        verifyCatalog
        readCatalog
        trainCatalog
        bookKeeping
        trainStatus
        getSkusForQuery
        getSimilarSkus
        imageSearch
        audioToText
      }
      isConfirmed
      isAdmin
      createdAt
      lastLogin
      file {
        items
        productApi
        productApiType
        uploadDate
      }
      smartSKU {
        widgets {
          location
          type
          heading
          noOfItems
          tagId
        }
        heading {
          enabled
          color
          fontSize
          family
        }
        productName {
          enabled
          color
          fontSize
          family
        }
        price {
          enabled
          color
          fontSize
          family
        }
        overlay {
          enabled
          computerVision
        }
      }
      smartVision {
        enabled
        buttonIconUrl
        headerText {
          enabled
          color
          fontSize
          family
        }
        uploadText {
          enabled
          color
          fontSize
          family
        }
      }
      tagConfig {
        productDetailUrl
        sku {
          tag
          attribute
          value
          index
        }
        cta {
          tag
          attribute
          value
          index
        }
      }
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        name
        attributes {
          SKU
          Name
          Category
          Description
          OriginalUrl
          Image
          Price
          Currency
          Brand
          lastUpdate
        }
        trainingStatus
        apiUsage {
          uploadCatalog
          verifyCatalog
          readCatalog
          trainCatalog
          bookKeeping
          trainStatus
          getSkusForQuery
          getSimilarSkus
          imageSearch
          audioToText
        }
        isConfirmed
        isAdmin
        createdAt
        lastLogin
        file {
          items
          productApi
          productApiType
          uploadDate
        }
        smartVision {
          enabled
          buttonIconUrl
        }
        tagConfig {
          productDetailUrl
        }
      }
      nextToken
    }
  }
`;
