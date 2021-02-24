/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProducts = /* GraphQL */ `
  subscription OnCreateProducts {
    onCreateProducts {
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
export const onCreateEngagements = /* GraphQL */ `
  subscription OnCreateEngagements {
    onCreateEngagements {
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
export const onCreateOrders = /* GraphQL */ `
  subscription OnCreateOrders {
    onCreateOrders {
      id
      SKU
      Price
      Currency
      quantity
      engagementID
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
