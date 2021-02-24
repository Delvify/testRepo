import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  InputGroup,
  InputGroupAddon,
  FormFeedback,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import csv from 'csvtojson';

import xml2js from 'xml2js';
import { useDropzone } from 'react-dropzone';
import Progress from "reactstrap/es/Progress";
import {configMapper} from "../../utils/mappers";
import {Divider} from "../../components/atoms";
import * as queries from "../../graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';
import moment from "moment";
import {useForm} from "react-hook-form";
import * as mutations from "../../graphql/mutations";
import {Link} from "react-router-dom";
import Button from "../../components/atoms/Button";


const jsonFile = require('../../assets/img/file-json.svg');
const csvFile = require('../../assets/img/file-csv.svg');
const xmlFile = require('../../assets/img/file-xml.svg');

const acceptedFileTypes = ['.csv', '.json', '.xml', 'text/csv', 'application/csv', 'application/json', 'application/xml'];
const acceptedExtensions = ['csv', 'json', 'xml'];

const statuses = {
  IDLE: 'IDLE',
  EMPTY: 'EMPTY',
  UPLOADING: 'UPLOADING',
  UPLOADED: 'UPLOADED',
  SUBMITTING: 'SUBMITTING',
  SUBMITTED: 'SUBMITTED',
  SEND_TRAINING: 'SEND_TRAINING',
  START_TRAINING: 'START_TRAINING',
};

const attributesConfig = {
  SKU: { label: 'SKU', required: true, defaultValue: 'SKU' },
  Name: { label: 'Name', required: true, defaultValue: 'Name' },
  Category: { label: 'Category', required: true, defaultValue: 'Category' },
  Description: { label: 'Description', required: true, defaultValue: 'Description' },
  OriginalUrl: { label: 'OriginalUrl', required: true, defaultValue: 'OriginalUrl' },
  Image: { label: 'Image', required: true, defaultValue: 'Image' },
  Price: { label: 'Price', required: true, defaultValue: 'Price', parser: ((data) => parseFloat(data)) },
  Currency: { label: 'Currency', required: true, defaultValue: 'Currency' },
  Brand: { label: 'Brand', required: true, defaultValue: 'Brand' },
};

const mapStateToProps = (state) => ({
  me: window._.get(state, ['auth', 'user'], {})
});

const renameAttributes = (json, keyMap) => {
  const temp = window._.cloneDeep(json);
  temp.forEach((row) => {
    Object.keys(keyMap).forEach((newKey) => {
      const oldKey = keyMap[newKey];
      row[newKey] = attributesConfig[newKey].parser ? attributesConfig[newKey]['parser'](row[oldKey]) : row[oldKey];
    })
  });
  return(temp.map(item => window._.pick(item, Object.keys(attributesConfig))));
};

const Upload = (props) => {
  const { me } = props;
  const [attributes, setAttributes] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState(statuses.EMPTY);
  const [file, setFile] = useState(null);
  const [json, setJson] = useState(null);
  const [newJson, setNewJson] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [catalogStat, setCatalogStat] = useState({});
  const [trainStatus, setTrainStatus] = useState(statuses.IDLE);
  const [apiDropdownOpen, setAPIDropdownOpen] = useState(false);
  const [productAPIFileType, setProductAPIFileType] = useState('json');

  const { register, handleSubmit, reset, errors, formState } = useForm();
  const { register: registerAPI, handleSubmit: handleSubmitAPI, errors: errorsAPI, setError: setAPIError, formState: formStateAPI, setValue: setValueAPI } = useForm();
  const { isSubmitting: isSubmittingAPI } = formStateAPI;
  const { isSubmitting, isSubmitted, dirty} = formState;

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    if (attributes && headers) {
      reset({ ...attributes });
    }
  }, [attributes, headers]);

  const getConfig = useCallback(async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(queries.getUser, { id: me.username }));
      const defaultAttributes = window._.fromPairs(Object.keys(attributesConfig).map((key) => ([key, attributesConfig[key]['defaultValue']])));
      const attributes = window._.omit(data.getUser.attributes, lastUpdate);
      setAttributes( { ...defaultAttributes, ...attributes });
      setProductAPIFileType(window._.get(data, ['getUser', 'file', 'productApiType'], null) || 'json');
      setValueAPI('productAPI', window._.get(data, ['getUser', 'file', 'productApi'], null));
      setLastUpdate(window._.get(data, ['getUser', 'attributes', 'lastUpdate'], null));
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getHeaders = useCallback((fileString, fileType) => {
    return new Promise((resolve, reject) => {
      switch (fileType) {
        case 'json':
          try {
            const json = JSON.parse(fileString);
            return resolve({ headers: Object.keys(json[0]), json: json });
          } catch (e) {
            return reject(new Error('Unable to parse JSON.'));
          }
        case 'csv':
          return csv({ flatKeys: true })
            .fromString(fileString)
            .then((json) => {
              return resolve({ headers: Object.keys(json[0]), json: json });
            });
        case 'xml':
          const xmlParser = new xml2js.Parser();
          xmlParser.parseString(fileString, (err, result) => {
            if (err || !result) return reject(new Error('Unable to parse XML.'));
            let json = null;
            if (result.rss || result['rdf:RDF']) {
              // rss1
              if(result['rdf:RDF']) {
                result = result['rdf:RDF'];
              }
              const channel = result.rss.channel[0];
              const items = channel.item;
              json = [];
              items.forEach((item) => {
                const parsedItem = {};
                Object.keys(item).forEach((key) => {
                  parsedItem[key] = item[key][0];
                });
                json.push(parsedItem);
              })
            } else {
              json = result;
              while(!Array.isArray(json)) {
                json = json[Object.keys(json)[0]];
              }
              if (!Array.isArray(json)) {
                return reject(new Error('Unable to parse XML.'));
              }
              json = json.map(item => {
                Object.keys(item).forEach((key) => {
                  item[key] = item[key].join();
                });
                return item;
              });
            }
            return resolve({ headers: Object.keys(json[0]), json: json });
          });
        }
    })

  }, []);

  const onDropAccepted = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setError(null);
    const url = window.URL.createObjectURL(file);
    setFile({ file: file, name: file.name, type: file.type, size: file.size, url });
    setStatus(statuses.UPLOADING);
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onprogress = (progress) => {
      setUploadProgress((progress.loaded/progress.total) * 100);
    };
    reader.onload = () => {
      setTimeout(() => {
        setStatus(statuses.UPLOADED);
      }, 500);
      getHeaders(reader.result, checkFileType(file))
        .then(({ headers, json }) => {
          setFile({ file: file, name: file.name, type: file.type, size: file.size, url, rows: json.length });
          setHeaders([null, ...(headers.sort())]);
          setJson(json);
        })
        .catch((e) => {
          setError(e.message);
        });
    }
  }, []);

  const onDropRejected = useCallback((rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 1) {
      setError('Please submit one file only');
    } else if (!window._.isEmpty(rejectedFiles) && !acceptedExtensions.includes(checkFileType(rejectedFiles[0]))) {
      setError('Incorrect file type');
    }
  }, []);

  const closeStatModal = useCallback(() => {
    setCatalogStat({});
  }, []);

  const trainData = useCallback(async () => {
    setTrainStatus(statuses.SEND_TRAINING);
    try {
      const trainResult = await API.post('mlserverapi', '/mlserverapi', { body: { endpoint: 'trainCatalog', userID: me.username }});
      const fileData = JSON.stringify(newJson);
      const blob = new Blob( [ fileData ], {
        type: 'application/octet-stream'
      });
      const formData = new FormData();
      formData.append('file', blob, 'catalog.json');
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/fs/storeCatalog/${me.username}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      await API.graphql(graphqlOperation(mutations.updateUser, {
        input: {
          id: me.username,
          file: {
            ...(file.productAPI ? { productApi: file.productAPI } : {}),
            ...(file.productAPIFileType ? { productApiType: file.productAPIFileType } : {}),
            items: newJson.length,
            uploadDate: (new Date).toISOString()
          }
        }
      }));
      setTrainStatus(statuses.START_TRAINING);
    } catch (e) {
      console.log(e);
      setTrainStatus(statuses.IDLE);
      closeStatModal();
    }
  }, [newJson, file]);

  const onSubmit = useCallback(async (data) => {
    const timeStamp = moment().toISOString();
    try {
      const result = await API.graphql(graphqlOperation(mutations.updateUser, { input: { id: me.username, attributes: { ...data, lastUpdate: timeStamp } } }));
    } catch (e) {
      console.error(e);
    }
    const newJson = renameAttributes(json, data);
    setNewJson(newJson);
    try {
      const fileData = JSON.stringify(newJson);
      const blob = new Blob( [ fileData ], {
        type: 'application/octet-stream'
      });
      const formData = new FormData();
      formData.append('file', blob, 'catalog.json');
      await fetch(`${process.env.REACT_APP_API_HOST}/fs/uploadCatalog/${me.username}`, { method: 'POST', body: formData });
      await API.post('mlserverapi', '/mlserverapi', { body: { endpoint: 'trackAPIUsage', trackingEndpoint: 'uploadCatalog', userID: me.username }});
      const statResult = await API.post('mlserverapi', '/mlserverapi', { body: { endpoint: 'catalogStats', userID: me.username }});
      setCatalogStat(statResult);
    } catch (e) {
      console.error(e);
    }

    setLastUpdate(timeStamp);
  }, [json]);


  const toggleAPIDropDown = useCallback(() => setAPIDropdownOpen(!apiDropdownOpen), [apiDropdownOpen]);

  const onSubmitAPI = useCallback(async (data) => {
    const { productAPI } = data;
    if (!productAPI) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/fs/parseCatalog/${me.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          productAPI: productAPI,
          type: productAPIFileType,
        })
      });
      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      const { headers, json } = await getHeaders(JSON.stringify(result), 'json');
      setFile({ productAPI: productAPI, productAPIFileType: productAPIFileType, rows: json.length });
      setHeaders([null, ...(headers.sort())]);
      setJson(json);
      setStatus(statuses.UPLOADED);
    } catch (e) {
      console.error(e);
      setAPIError('productAPI', 'Error', e.message);
    }
  }, [productAPIFileType]);

  const checkFileType = useCallback((file) => {
    return file.name.split('.')[1] || "";
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDropAccepted, accept: acceptedFileTypes.concat(', '), onDropRejected, multiple: false });

  return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <div><strong>Upload Product Feed Data</strong></div>
            <div>Your custom AI model needs data and your product feed data is the source of this power!<br/>
            You can upload your file directly and map the fields or download our template.</div>
          </div>
          <div className="text-right">
            <Link to="/template.csv" target="_blank" download={'catalog.csv'}><Button size="sm" type="button" color="info">Download Template</Button></Link>
          </div>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmitAPI(onSubmitAPI)}>
            <InputGroup>
              <InputGroupButtonDropdown addonType="prepend" isOpen={apiDropdownOpen} toggle={toggleAPIDropDown}>
                <DropdownToggle caret>
                  { `Product Feed API (${productAPIFileType})` }
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setProductAPIFileType('json')}>json</DropdownItem>
                  <DropdownItem onClick={() => setProductAPIFileType('csv')}>csv</DropdownItem>
                  <DropdownItem onClick={() => setProductAPIFileType('xml')}>xml</DropdownItem>
                </DropdownMenu>
              </InputGroupButtonDropdown>
              <Input
                invalid={!!errorsAPI.productAPI}
                type="text"
                name="productAPI"
                innerRef={(ref) => { registerAPI(ref) }}
                placeholder="https://..."
              />
              <InputGroupAddon addonType="append">
                <Button type="submit" color="primary" loading={isSubmittingAPI}><i className="fa fa-download"/></Button>
              </InputGroupAddon>
              { errorsAPI.productAPI && <FormFeedback>{ errorsAPI.productAPI.message }</FormFeedback> }
            </InputGroup>
          </Form>
          <Divider mv={3} >OR</Divider>
          <div
            className="align-items-center d-flex flex-column border-primary jumbotron border-primary drag-area-input"
            style={ isDragActive ? { border: '3px dashed' } : {} }
            {...getRootProps({ onClick: (e) => { e.stopPropagation(); }})}
          >
            <input {...getInputProps()} />
            {
              file && file.file ?
                <div className="mb-2 text-center">
                  <img src={checkFileType(file).includes('csv') ? csvFile : checkFileType(file).includes('xml') ? xmlFile : jsonFile} style={{ height: '95px' }} alt={file.name} />
                  <div className="mt-1">{`${file.name} • ${(file.size / 1024).toFixed(2)}KB • ${file.rows || 0} Items`} </div>
                </div> :
                <div><i className="icon-cloud-upload display-1 text-primary"/></div>
            }
            <div>
              <span><Button type="button" size="sm" color="primary" onClick={(e) => { getRootProps().onClick(e); }}>
                Choose a file
              </Button> or drag and drop it here</span>
            </div>
            <div>Accepted file format: .csv, .json, .xml</div>
            {
              !!error && <div className="text-danger mt-1">{error}</div>
            }
          </div>
          <Form>
            <div>
              <h5 className="text-center mb-4">Map your product feed fields below.<br/>
              For more information on the fields see examples <a href="https://docs.delvify.io/delvify-ai/sending-events#item-attributes" target="_blank">here</a>. </h5>
              {
                status === statuses.UPLOADING && <Progress value={uploadProgress} className="mb-3" style={{ height: '3px' }}/>
              }
                <Col style={{ columnCount: 2 }}>
                  {
                    Object.keys(attributesConfig).map((config) =>
                      <Row className="mb-2" key={`attribute_${config}`} style={{ breakInside: 'avoid' }}>
                        <Col sm={3}>{config}: </Col>
                        <Col sm={7}>
                          <Input
                            invalid={!!errors[config]}
                            type="select"
                            name={config}
                            id={config}
                            innerRef={(ref) => { register(ref, { required: attributesConfig[config].required }); }}
                          >
                            {
                              headers.map((header) =>
                                <option key={`option_${header}`} value={header}>{header}</option>
                              )
                            }
                          </Input>
                        </Col>
                      </Row>
                    )
                  }
                </Col>
            </div>
          </Form>
        </CardBody>
        <CardFooter>
            <Row className="justify-content-between align-items-center">
              <Col>
                {lastUpdate &&
                  <div className="text-dark">
                    {`Last Update: ${moment(lastUpdate).format('DD MMM YYYY hh:mm:ss')}`}
                  </div>
                }
              </Col>
              <Col>
                <Button loading={isSubmitting} onClick={handleSubmit(onSubmit)} size="sm" color="primary" className="float-right" disabled={status !== statuses.UPLOADED}>
                  <span>Upload</span>
                </Button>
              </Col>
            </Row>
          </CardFooter>
      </Card>
      <Modal isOpen={!window._.isEmpty(catalogStat)} toggle={closeStatModal} backdrop={trainStatus === statuses.SEND_TRAINING ? 'static' : true}>
        <ModalHeader>Catalog Statistic</ModalHeader>
        <ModalBody>
          {
            Object.keys(catalogStat).map((key, index) => {
              return (
                <Row key={`stat_${index}`}><Col>{key}</Col><Col>{catalogStat[key]}</Col></Row>
              )
            })
          }
        </ModalBody>
        <ModalFooter>
          {
            trainStatus === statuses.START_TRAINING ?
              <div className="text-right">Training is started.<br/>You can check the status on <Link to="onboarding"><Button color="primary" size="sm"><i className="icon-control-play"/> Onboarding</Button></Link> page</div> :
              <div>
                <Button onClick={closeStatModal} className="mr-1">Cancel</Button>
                <Button color="primary" loading={trainStatus === statuses.SEND_TRAINING} onClick={trainData}>Start training</Button>
              </div>
          }
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default connect(mapStateToProps)(Upload);
