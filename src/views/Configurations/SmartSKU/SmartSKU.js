import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import { v1 as uuid } from 'uuid';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input, InputGroup, InputGroupAddon, InputGroupText,
  Label, UncontrolledPopover, PopoverBody,
  Row, UncontrolledTooltip,
} from 'reactstrap';
import {Spinner, CustomInput} from "reactstrap/es";
import { SketchPicker } from 'react-color';

import {Divider} from "../../../components/atoms";
import WidgetPreview from "../../../components/organisms/WidgetPreview";
import {INIT_CONFIG} from "../../../utils/constants";


const locations = {
  HOME_PAGE: 'Home Page',
  PRODUCT_PAGE: 'Product Page',
  CART_PAGE: 'Cart Page',
};

const types = {
  SIMILAR: 'AI Similar Items',
  VISUALLY_SIMILAR: 'Visually Similar Items',
  TRENDING: 'Trending',
  BEST_SELLING: 'Best Selling',
  INVENTORY: 'Inventory',
};

const statuses = {
  INITIAL: 'INITIAL',
  CHANGING: 'CHANGING',
  LOADING: 'LOADING',
  SAVED: 'SAVED',
};


const mapStateToProps = (state) => ({
  me: window._.get(state, ['auth', 'user'], {})
});

const WidgetRow = (props) => {
  const { widget, onChange, onRemove, innerRef, config, index } = props;
  const { heading, location, type, tagId, noOfItems } = widget;
  const [displayOverlay, setDisplayOverlay] = useState(false);

  const handelWidgetChange = useCallback((delta) => {
    const key = Object.keys(delta)[0];
    const temp = window._.cloneDeep(widget);
    temp[key] = delta[key];
    onChange(temp);
  }, [widget]);


  return (
    <Row className="position-relative">
      <Col>
        <div className="border rounded p-3 mb-3">
          <h6>{`Widget ${index + 1}`}</h6>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label htmlFor="location">Location</Label>
                <Input
                  defaultValue={widget.location}
                  innerRef={innerRef}
                  type="select"
                  name={`widgetLocation_${index}`}
                  id={`widgetLocation_${index}`}
                  onChange={(e) => { handelWidgetChange({ location: e.target.value }); }}
                >
                  {
                    Object.keys(locations).map((key) => <option key={`option_${key}`} value={key}>{locations[key]}</option>)
                  }
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label htmlFor="location">Type</Label>
                <Input
                  defaultValue={widget.type}
                  innerRef={innerRef}
                  type="select"
                  name={`widgetType_${index}`}
                  id={`widgetType_${index}`}
                  onChange={(e) => { handelWidgetChange({ type: e.target.value }); }}
                >
                  {
                    location === 'PRODUCT_PAGE' ?
                      Object.keys(types).map((key) => <option key={`option_${key}`} value={key}>{types[key]}</option>) :
                      Object.keys(window._.omit(types, ['SIMILAR', 'VISUALLY_SIMILAR'])).map((key) => <option key={`option_${key}`} value={key}>{types[key]}</option>)
                  }
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label htmlFor="widget_heading">Widget Heading</Label>
                <Input
                  innerRef={innerRef}
                  type="text"
                  id={`widgetHeading_${index}`}
                  name={`widgetHeading_${index}`}
                  placeholder="Widget Heading"
                  defaultValue={widget.heading}
                  onChange={(e) => { handelWidgetChange({ heading: e.target.value }); }}
                />
              </FormGroup>
            </Col>
            <Col md="2">
              <FormGroup>
                <Label htmlFor="no_of_items">Number of items</Label>
                <Input
                  defaultValue={widget.noOfItems}
                  innerRef={innerRef}
                  type="select"
                  name={`widgetNoOfItems_${index}`}
                  id={`widgetNoOfItems_${index}`}
                  onChange={(e) => { handelWidgetChange({ noOfItems: e.target.value }); }}
                >
                  {
                    [3,4,5,6,7,8,9,10].map((num) => <option key={`no_of_items_${num}`}>{num}</option>)
                  }
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Label className="font-weight-bold">Preview</Label>
          <WidgetPreview config={config} widget={widget} index={index} />
        </div>
      </Col>
      <Button className="position-absolute" style={{ top: 0, right: 15 }} onClick={(e) => { onRemove(e); }}><i className="icon-minus icons" /></Button>
    </Row>
  )
};

WidgetRow.defaultProps = {
  index: 0,
  heading: '',
  location: '',
  noOfItems: 5,
  onChange: () => {},
  onRemove: () => {},
};

const FontConfig = (props) => {
  const { prefix, label, maxFontSize = 50, config, onChange, innerRef, ...options } = props;

  const onColorPickerChange = useCallback((color) => {
    handelConfigChange({ color: color.hex });
  }, [config]);

  const toggleSwitch = useCallback(() => {
    handelConfigChange({ enabled: !config.enabled });
  }, [config]);

  const handelConfigChange = useCallback((delta) => {
    const key = Object.keys(delta)[0];
    const temp = window._.cloneDeep(config);
    temp[key] = delta[key];
    onChange(temp);
  }, [config]);

  return (
    <Col { ...options } className="mb-2">
      <Row className="align-items-center">
        <Col sm={5}>
          <Label className="m-0 font-weight-bold">{label}</Label>
        </Col>
        <Col>
          <CustomInput innerRef={innerRef} type="switch" id={`${prefix}FontConfigSwitch`} name={`${prefix}FontConfigSwitch`} onChange={toggleSwitch} checked={config.enabled}/>
        </Col>
      </Row>
      <Collapse isOpen={config.enabled}>
        <Row>
          <Col>
            <Label htmlFor="themedColor">Font Color</Label>
            <Button type="button" id={`${prefix}ColorTile`} style={{ width: '100%', height: 32, borderRadius: 5, border: 'solid 1px lightgray', backgroundColor: config.color, cursor: 'pointer' }}/>
            <UncontrolledPopover placement="right" target={`${prefix}ColorTile`} trigger="legacy">
              <PopoverBody><SketchPicker color={config.color} onChange={onColorPickerChange} /></PopoverBody>
            </UncontrolledPopover>
          </Col>
          <Col>
            <Label htmlFor="font_size">Font size</Label>
            <InputGroup>
              <InputGroup>
                <Input
                  innerRef={innerRef}
                  type="number"
                  min="1"
                  max={maxFontSize}
                  id={`${prefix}FontSize`}
                  name={`${prefix}FontSize`}
                  defaultValue={config.fontSize}
                  onChange={(e) => { handelConfigChange({ fontSize: e.target.value }) }}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>pt</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </InputGroup>
          </Col>
          <Col>
            <Label htmlFor="font_family">Font family</Label>
            <Input
              innerRef={innerRef}
              onChange={(e) => { handelConfigChange({ family: e.target.value }) }}
              type="select"
              defaultValue={config.family}
              name={`${prefix}FontFamily`}
              id={`${prefix}FontFamily`}
            >
              {
                ['Default', 'Times New Roman', 'Georgia', 'Arial', 'Arial Black', 'Comic Sans MS', 'Impact', 'Tahoma', 'Trebuchet MS', 'Verdana']
                  .map((key, index) => <option key={`font_${index}`} value={key}>{key}</option>)
              }
            </Input>
          </Col>
        </Row>
      </Collapse>
    </Col>
  )
};

const SmartSKU = (props) => {
  const { me } = props;

  const { register, handleSubmit, reset, errors, formState } = useForm();
  const { isSubmitting, isSubmitted, dirty} = formState;

  const [config, setConfig] = useState({
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
  });

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = useCallback(async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(queries.getUser, { id: me.username }));
      const config = window._.get(data, ['getUser', 'smartSKU'], null);
      if (config) {
        setConfig(config);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onAddWidget = useCallback(() => {
    const newWidget = {
      location: 'HOME_PAGE',
      type: 'TRENDING',
      heading: 'Featured Items',
      tagId: `delvifyRecommendationTrending`,
      noOfItems: 5,
    };
    onInputChange({ widgets: [...config.widgets, newWidget] });
  }, [config]);

  const onWidgetRemove = useCallback((index) => {
    const tempWidgets = window._.clone(config.widgets);
    tempWidgets.splice(index, 1);
    onInputChange({ widgets: tempWidgets });
  }, [config, reset]);

  const onWidgetChange = useCallback((index, delta) => {
    const tempWidgets = window._.clone(config.widgets);
    tempWidgets[index] = { ...tempWidgets[index], ...delta };
    tempWidgets[index]['tagId'] = `delvifyRecommendation${window._.startCase(window._.camelCase(tempWidgets[index]['type'])).replace(/\s+/g, '', '')}`;
    onInputChange({ widgets: tempWidgets });
  }, [config]);

  const toggleOverlay = useCallback(() => {
    onInputChange({ overlay: { enabled: !config.overlay.enabled, computerVision: false } });
  }, [config]);

  const toggleComputerVision = useCallback(() => {
    onInputChange({ overlay: { enabled: true, computerVision: !config.overlay.computerVision } });
  }, [config]);

  const onInputChange = useCallback((delta) => {
    const key = Object.keys(delta)[0];
    const temp = window._.cloneDeep(config);
    temp[key] = delta[key];
    setConfig(temp);
  }, [config, reset]);

  const onSubmit = useCallback(async (data) => {
    try {
      const result = await API.graphql(graphqlOperation(mutations.updateUser, { input: { id: me.username, smartSKU: config } }));
    } catch (e) {
      console.log(e);
    }
  }, [config]);

  return (
    <div className="animated fadeIn">
      <Form role="form" onSubmit={handleSubmit(onSubmit)} className="form-horizontal">
        <Card>
          <CardHeader>
            <div><strong>Widget Design</strong></div>
            <div>While we train your AI model, configure your recommendation widget settings and design.<br/>
            For custom configuration or design requirements please reach out to your Account Manager.<br/>
            You can create as many widget configurations as you need for your website.</div>
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm={6}>
                <Row className="align-items-center">
                  <Col sm={5}>
                    <Label className="m-0 font-weight-bold">
                      {'Enable Overlay'}
                      <i className="fa fa-info-circle text-muted ml-1" id="overlayInfo" />
                    </Label>
                    <UncontrolledTooltip placement="top" target="overlayInfo">
                      By enabling this function, your user will be able to see the product details from a pop up windows instead of being redirected to the product page.
                    </UncontrolledTooltip>
                  </Col>
                  <Col>
                    <CustomInput innerRef={(ref) => register(ref)} type="switch" id={'overlaySwitch'} name={'overlaySwitch'} onChange={toggleOverlay} checked={config.overlay.enabled}/>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Collapse isOpen={config.overlay.enabled}>
                  <Row className="align-items-center">
                    <Col sm={5}>
                      <Label className="m-0 font-weight-bold">
                        {'Enable Computer Vision'}
                        <i className="fa fa-info-circle text-muted ml-1" id="computerVisionInfo" />
                      </Label>
                      <UncontrolledTooltip placement="top" target="computerVisionInfo">
                        By enable this function, your user can search for visually similar product within our widget.
                      </UncontrolledTooltip>
                    </Col>
                    <Col>
                      <CustomInput innerRef={(ref) => register(ref)} type="switch" id={'computerVisionSwitch'} name={'computerVisionSwitch'} onChange={toggleComputerVision} checked={config.overlay.computerVision}/>
                    </Col>
                  </Row>
                </Collapse>
              </Col>
            </Row>
            <Divider mv={3}/>
              <Row>
                <FontConfig onChange={(delta) => { onInputChange({ heading: delta }); }} innerRef={(ref) => register(ref)} prefix={'heading'} label={'Heading'} maxFontSize={'50'} config={config.heading} />
                <FontConfig onChange={(delta) => { onInputChange({ productName: delta }); }} innerRef={(ref) => register(ref)} prefix={'productName'} label={'Product Name'} maxFontSize={'15'} config={config.productName} />
              </Row>
              {
                /* Temporally disable price
                <Row>
                  <FontConfig onChange={(delta) => { onInputChange({ price: delta }); }} sm={6} prefix={'price'} label={'Price'} maxFontSize={'15'} config={config.price} />
                </Row>

                 */
              }
              <Divider mv={3}/>

              <FormGroup row>
                <Col>
                  <div><Label className="font-weight-bold">Widget</Label></div>
                    {
                      config.widgets.map((widget, index) =>
                        <WidgetRow
                          key={`widget_${index}`}
                          index={index}
                          widget={widget}
                          onChange={(delta) => { onWidgetChange(index, delta); }}
                          onRemove={(index) => { onWidgetRemove(index); }}
                          innerRef={(ref) => register(ref)}
                          config={config}
                        />)
                    }
                  <div><Button color="primary" onClick={onAddWidget}><i className="icon-plus icons" /> Add Widget</Button></div>
                </Col>
              </FormGroup>
          </CardBody>
          <CardFooter>
            <Button type="submit" size="sm" color={isSubmitted ? 'success' : 'primary'} className="float-right" disabled={isSubmitting}>
              <span>
                {
                  isSubmitting ?
                    <Spinner color={'white'} size={'sm'} /> :
                    isSubmitted ?
                      <i className="fa fa-check" /> :
                      <i className="fa fa-dot-circle-o" />
                }
              </span>
              <span>
                {
                  isSubmitting ?
                    ' Loading' :
                    isSubmitted ?
                      ' Saved' : ' Save'
                }
              </span>
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps)(SmartSKU);
