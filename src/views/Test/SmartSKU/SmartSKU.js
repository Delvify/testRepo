import React, { useCallback, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Header from "../../../components/atoms/Header";
import Card from "../../../components/layouts/Card";
import styled from "@emotion/styled";
import WidgetPreview, {mapProduct} from "../../../components/organisms/WidgetPreview";
import {Button} from "../../../components/atoms";

import { color } from '../../../utils/styleVariables';
import Spinner from "reactstrap/es/Spinner";
import {TRAINING_STATUS} from "../../../utils/enums";

const mapStateToProps = (state) => ({
  me: window._.get(state, ['auth', 'user'], {})
});

const Container = styled('div')({
  paddingBottom: '100px',
});

const Picker = styled('div')({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  columnGap: '10px',
  justifyContent: 'center',
  flexWrap: 'wrap',
});

const Thumbnail = styled('div')(
  {
    width: '100px',
    height: '100px',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
    '&>img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    }
  },
  ({ selected }) => selected ? {
    border: `1px solid ${ color.border.selected }`
  } : {});

const SmartSKU = (props) => {
  const { me } = props;
  const [trainingStatus, setTrainingStatus] = useState(TRAINING_STATUS.INIT);
  const [sku, setSku] = useState(null);
  const [displayProducts, setDisplayProducts] = useState(null);
  const [similarProducts, setSimilarProducts] = useState(null);
  const [visuallySimilarProducts, setVisuallySimilarProducts] = useState(null);
  const [trendingProducts, setTrendingProducts] = useState(null);
  const [bestSellingProducts, setBestSellingProducts] = useState(null);
  const [inventoryProducts, setInventoryProducts] = useState(null);

  useEffect(() => {
    getTrainingStatus();
  }, []);

  useEffect(() => {
    if (trainingStatus == TRAINING_STATUS.COMPLETED) {
      getRandomProducts();
      getProducts('TRENDING');
      getProducts('BEST_SELLING');
      getProducts('INVENTORY');
    }
  }, [trainingStatus]);

  useEffect(() => {
    if (sku) {
      getProducts('SIMILAR');
      getProducts('VISUALLY_SIMILAR');
    }
  }, [sku]);

  useEffect(() => {
    if (sku) {
      window.delvifyDataLayer.push({
        event: 'init',
        product: {
          sku: sku,
        },
      });
    }
  }, []);

  const getTrainingStatus = useCallback(async() => {
    const status = await (await fetch(`${process.env.REACT_APP_ML_API_HOST}`, { method: 'POST', body: JSON.stringify({
        endpoint: 'trainStatus',
        userID: me.username,
      })})).json();
    if (status === 'Training Completed') {
      setTrainingStatus(TRAINING_STATUS.COMPLETED);
    } else {
      setTrainingStatus(TRAINING_STATUS.TRAINING);
    }
  }, []);

  const getRandomProducts = useCallback(async () => {
    setDisplayProducts(null);
    const products = (await (await fetch(`${process.env.REACT_APP_GET_PRODUCTS_API}/${me.username}/rand?limit=10`)).json()).map(mapProduct);
    setDisplayProducts(products);
    setSku(products[0].sku);
  }, []);

  const onItemClick = useCallback((sku) => {
    setSku(sku);
  }, []);

  const getCVProducts = useCallback(async (sku) => {
    const skus = JSON.parse(await (await fetch(`${process.env.REACT_APP_ML_API_HOST}`, { method: 'POST', body: JSON.stringify({
          endpoint: 'imageSearchBySKU',
          userID: me.username,
          data: { sku: sku },
        })})).json())['skus'].slice(0, 6);

    return (await (await fetch(`${process.env.REACT_APP_GET_PRODUCTS_API}/${me.username}?sku=${skus.join(',')}`)).json()).map(mapProduct);
  }, []);

  const getProducts = useCallback(async (source) => {
    let skus = null;
    const setProducts = {
      SIMILAR: setSimilarProducts,
      VISUALLY_SIMILAR: setVisuallySimilarProducts,
      TRENDING: setTrendingProducts,
      BEST_SELLING: setBestSellingProducts,
      INVENTORY: setInventoryProducts,
    }[source];
    setProducts(null);
    try {
      if (source === 'SIMILAR') {
        skus = JSON.parse(await (await fetch(`${process.env.REACT_APP_ML_API_HOST}`, { method: 'POST', body: JSON.stringify({
            endpoint: 'getSimilarSkus',
            userID: me.username,
            data: { sku: sku },
          })})).json())['skus'].slice(0, 5);
      } else if (source === 'VISUALLY_SIMILAR') {
        skus = JSON.parse(await (await fetch(`${process.env.REACT_APP_ML_API_HOST}`, { method: 'POST', body: JSON.stringify({
            endpoint: 'imageSearchBySKU',
            userID: me.username,
            data: { sku: sku },
          })})).json())['skus'].slice(0, 5);
      } else {
        const orderBy = {
          TRENDING: 'CLICK',
          BEST_SELLING: 'PURCHASE',
          INVENTORY: 'PURCHASE',
        }[source];
        const order = {
          TRENDING: 'DESC',
          BEST_SELLING: 'DESC',
          INVENTORY: 'ASC',
        }[source];
        skus = (await (await fetch(`${process.env.REACT_APP_ENGAGEMENT_API}/${me.username}?orderBy=${orderBy}&order=${order}&limit=5`)).json()).map((item) => item.SKU);
      }
      const products = (await (await fetch(`${process.env.REACT_APP_GET_PRODUCTS_API}/${me.username}?sku=${skus.join(',')}`)).json()).map(mapProduct);
      setProducts(products);
    } catch (e) {
      console.log(e);
    }
  }, [sku]);

  return (
    <Container>
      {
        trainingStatus === TRAINING_STATUS.INIT ? null :
          trainingStatus === TRAINING_STATUS.COMPLETED ?
            <div>
              <Card>
                <Header title={'Your products'} Button={<Button onClick={getRandomProducts} loading={!displayProducts}><i className="icon icon-refresh"/> Refresh</Button>}>
                  See how it works with your products
                </Header>
                <Picker>
                  {
                    displayProducts ? displayProducts.map((product) =>
                      <Thumbnail key={`product_${product.sku}`} src={product.image} onClick={() => { onItemClick(product.sku) }} selected={sku === product.sku}>
                        <img src={product.image} />
                      </Thumbnail>
                    ) : null
                  }
                </Picker>
              </Card>
              <Card>
                {
                  similarProducts ?
                    <WidgetPreview widget={{ heading: 'Similar Items', noOfItems: 5 }} index={0} products={similarProducts} getCVProducts={getCVProducts} /> : <Spinner />
                }
              </Card>
              <Card>
                {
                  visuallySimilarProducts ?
                    <WidgetPreview widget={{heading: 'Visually Similar Items', noOfItems: 5}} index={1}
                                   products={visuallySimilarProducts} getCVProducts={getCVProducts}/> : <Spinner />
                }
              </Card>
              <Card>
                {
                  trendingProducts ?
                    <WidgetPreview widget={{heading: 'Trending Items', noOfItems: 5}} index={1}
                                   products={trendingProducts} getCVProducts={getCVProducts}/> : <Spinner />
                }
              </Card>
              <Card>
                {
                  bestSellingProducts ?
                    <WidgetPreview widget={{heading: 'Best Selling Items', noOfItems: 5}} index={1}
                                   products={bestSellingProducts} getCVProducts={getCVProducts}/> : <Spinner />
                }
              </Card>
              <Card>
                {
                  inventoryProducts ?
                    <WidgetPreview widget={{heading: 'Inventory Items', noOfItems: 5}} index={1}
                                   products={inventoryProducts} getCVProducts={getCVProducts}/> : <Spinner />
                }
              </Card>
            </div> :
            <Card>
              <Header title="Your training in under process."/>
            </Card>
      }

    </Container>
  );
};

export default connect(mapStateToProps)(SmartSKU);
