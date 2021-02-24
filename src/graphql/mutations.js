/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deleteProducts = /* GraphQL */ `
  mutation DeleteProducts($userID: String!, $SKU: String!) {
    deleteProducts(userID: $userID, SKU: $SKU) {
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
export const createProducts = /* GraphQL */ `
  mutation CreateProducts($createProductsInput: CreateProductsInput!) {
    createProducts(createProductsInput: $createProductsInput) {
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
export const updateProducts = /* GraphQL */ `
  mutation UpdateProducts($updateProductsInput: UpdateProductsInput!) {
    updateProducts(updateProductsInput: $updateProductsInput) {
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
export const deleteEngagements = /* GraphQL */ `
  mutation DeleteEngagements($id: Int!) {
    deleteEngagements(id: $id) {
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
export const createEngagements = /* GraphQL */ `
  mutation CreateEngagements($createEngagementsInput: CreateEngagementsInput!) {
    createEngagements(createEngagementsInput: $createEngagementsInput) {
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
export const updateEngagements = /* GraphQL */ `
  mutation UpdateEngagements($updateEngagementsInput: UpdateEngagementsInput!) {
    updateEngagements(updateEngagementsInput: $updateEngagementsInput) {
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
export const deleteOrders = /* GraphQL */ `
  mutation DeleteOrders($id: Int!) {
    deleteOrders(id: $id) {
      id
      SKU
      Price
      Currency
      quantity
      engagementID
    }
  }
`;
export const createOrders = /* GraphQL */ `
  mutation CreateOrders($createOrdersInput: CreateOrdersInput!) {
    createOrders(createOrdersInput: $createOrdersInput) {
      id
      SKU
      Price
      Currency
      quantity
      engagementID
    }
  }
`;
export const updateOrders = /* GraphQL */ `
  mutation UpdateOrders($updateOrdersInput: UpdateOrdersInput!) {
    updateOrders(updateOrdersInput: $updateOrdersInput) {
      id
      SKU
      Price
      Currency
      quantity
      engagementID
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
