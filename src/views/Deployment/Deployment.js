import React, { useCallback, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';

import { API, graphqlOperation } from 'aws-amplify';
import * as queries from "../../graphql/queries";
import WidgetPreview from "../../components/organisms/WidgetPreview";
import {Form, Input, Col, CustomInput, Row, Collapse, Label, InputGroup, FormGroup} from "reactstrap";
import {Link} from "react-router-dom";
import {CodeSnippet} from "../../components/molecules";
import Header from "../../components/atoms/Header";
import Card from "../../components/layouts/Card";
import CardTitle from "../../components/atoms/CardTitle";
import Button from "../../components/atoms/Button";
import styled from "@emotion/styled";
import {color} from '../../utils/styleVariables'

const INITIAL_VARIABLES = {
  sku: 'SKU',
  skuMeasure: 'SKU',
  price: 'PRICE',
  currency: 'CURRENCY',
  quantity: 'QUANTITY',
};

const PreviewToggle = ({ id, label, config, widget }) => {
  const StyledToggle = styled('div')({
    display: 'flex',
    alignItems: 'center',
    color: color.text.secondary,
    marginBottom: '55px',
    '&>div': {
      marginRight: '27px',
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <div>
      <StyledToggle>
        <div>{label}</div>
        <CustomInput type="switch" onChange={toggle} id={id} checked={isOpen}/>
      </StyledToggle>
      { isOpen && <WidgetPreview config={config} widget={widget} /> }
    </div>
  )
};

const mapStateToProps = (state) => ({
  me: window._.get(state, ['auth', 'user'], {})
});

const WidgetTag = styled('div')({
  '&:not(:last-child)': {
    marginBottom: '70px',
  }
});

const StyledInputGroupWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
});

const StyledInputGroup = styled(InputGroup)({
  alignItems: 'center',
  marginTop: '5px',
  '&:not:last-child': {
    marginRight: '10px',
  },
  '&>label': {
    marginBottom: 0,
    marginRight: '5px',
  },
  '&>input': {
    width: '100px !important',
    flexGrow: '0 !important'
  },
});

const Deployment = (props) => {
  const { me } = props;

  const [smartSKUConfig, setSmartSKUConfig] = useState({
    heading: { enabled: false, color: '#444444', fontSize: '14', family: 'Default' },
    productName:  { enabled: false, color: '#444444', fontSize: '10', family: 'Default' },
    price:  { enabled: false, color: '#444444', fontSize: '10', family: 'Default' },
    overlay: { enabled: false },
    computerVision: { enabled: false },
    widgets: [],
  });
  const [smartVisionConfig, setSmartVisionConfig] = useState({
    enabled: false,
  });
  const [variable, setVariable] = useState(INITIAL_VARIABLES);

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = useCallback(async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(queries.getUser, { id: me.username }));
      const smartSKUConfig = window._.get(data, ['getUser', 'smartSKU'], null);
      const smartVisionConfig = window._.get(data, ['getUser', 'smartVision'], null);
      if (smartSKUConfig) {
        setSmartSKUConfig(smartSKUConfig);
      }
      if (smartVisionConfig) {
        setSmartVisionConfig(smartVisionConfig);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onVariableChange = useCallback((delta) => {
    setVariable({ ...variable, ...delta });
  }, [variable]);

  return (
    <div className="animated fadeIn">
      <Header title={"DEPLOY"} type="main">
        After AI training and configurations are complete, please deploy the following tags to your website. <br/>
        <i className="fa fa-question-circle"/> For more information on the tags, please see here. If you require assistance, please speak with your Account Manager.
      </Header>
      <Card>
        <CodeSnippet
          type="main"
          title={'SMART Tag'}
          description={`Paste this code as high in the <head> of every pages of your website as possible. In order to allow our widget to work well on your website, this tag needs to be installed on every page of your website.`}
          rows={5}
        >
          {`<!-- Delvify Recommendation Start -->
<script>(function(w,d,s,i){w['delvifyDataLayer']=w['delvifyDataLayer']||[];var f=d.getElementsByTagName(s)[0], j=d.createElement(s);j.async=true;j.src='https://4ugisuc5f8.execute-api.ap-southeast-1.amazonaws.com/master/widget/'+i;f.parentNode.insertBefore(j,f);})(window,document,'script','${me.username}')</script>
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script type="text/javascript" src="https://delvify-recommendations-vendors.s3-ap-southeast-1.amazonaws.com/slick/slick.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://delvify-recommendations-vendors.s3-ap-southeast-1.amazonaws.com/slick/slick.css"/>
<!-- End Delvify Recommendation -->`}
        </CodeSnippet>
      </Card>
      <Card>
        <CardTitle>Widget Tags</CardTitle>
        {
          smartSKUConfig.widgets && smartSKUConfig.widgets.length > 0 ?
            <div>
              {
                window._.map(smartSKUConfig.widgets, (widget, index) => {
                  return (
                    <WidgetTag key={`widget_code_${index}`}>
                      <div>
                        <CodeSnippet
                          className="mb-2"
                          rows={1}
                          title={`Widget ${index+1}: ${widget.heading}`}
                          prepend={'Please install the tags on where the widget should be displayed, typically on the product detail page of your eCommerce.'}
                        >
                          {`<div id="${widget.tagId}" data-location="${widget.location}" data-type="${widget.type}"></div>`}
                        </CodeSnippet>
                      </div>
                      <PreviewToggle
                        id={`widget_toggle_${index}`}
                        label={`Preview Widget ${index+1}: ${widget.heading}`}
                        config={smartSKUConfig}
                        widget={widget}
                      />
                    </WidgetTag>
                  )
                })
              }
            </div> :
            <Header size='lg' title="Widget Tags">
              Please config widget and save on <Link to={'/config/smart-sku'}><Button color="primary"><i className="icon icon-settings"/> Smart SKU</Button></Link> page.
            </Header>
        }
      </Card>
      <Card>
        {
          smartVisionConfig && smartVisionConfig.enabled ?
            <CodeSnippet
              className="mb-2"
              rows={1}
              title={'Smart Vision Button'}
              prepend={'Please install the smart vision button on should be displayed.'}
            >
              {`<div id="delvifySmartVisionButton"></div>`}
            </CodeSnippet> :
            <Header size='lg' title="Smart Vision Button">
              Please enable smart vision and save on <Link to={'/config/smart-vision'}><Button color="primary"><i className="icon icon-settings"/> Smart Vision</Button></Link> page.
            </Header>
        }
      </Card>
      <Card>
        <Header title="Measuring Tags" size="lg">
          <div>Please enter the SKU value of this code, according to the name or terminology of your code:</div>
          <StyledInputGroupWrapper>
            <StyledInputGroup>
              <Label>SKU:</Label>
              <Input type="text" placeholder="SKU" bsSize={'sm'} onChange={(e) => { onVariableChange({ skuMeasure: e.target.value }); }} defaultValue={variable.skuMeasure}/>
            </StyledInputGroup>
            <StyledInputGroup>
              <Label>Price:</Label>
              <Input type="text" placeholder="PRICE" bsSize={'sm'} onChange={(e) => { onVariableChange({ price: e.target.value }); }} defaultValue={variable.price}/>
            </StyledInputGroup>
            <StyledInputGroup>
              <Label>Currency:</Label>
              <Input type="text" placeholder="CURRENCY" bsSize={'sm'} onChange={(e) => { onVariableChange({ currency: e.target.value }); }} defaultValue={variable.currency}/>
            </StyledInputGroup>
            <StyledInputGroup>
              <Label>Quantity:</Label>
              <Input type="text" placeholder="QUANTITY" bsSize={'sm'} onChange={(e) => { onVariableChange({ quantity: e.target.value }); }} defaultValue={variable.quantity}/>
            </StyledInputGroup>
          </StyledInputGroupWrapper>
        </Header>
        <CodeSnippet
          title="Measure A Checkout"
          rows={10}
        >
          {`window.delvifyDataLayer.push({
  event: 'purchase',
  products: [{
    sku: ${variable.skuMeasure}
    price: ${variable.price},
    currency: ${variable.currency},
    quantity: ${variable.quantity}
  },
  ...],
});`}
        </CodeSnippet>
      </Card>
    </div>
  )
};

export default connect(mapStateToProps)(Deployment);
