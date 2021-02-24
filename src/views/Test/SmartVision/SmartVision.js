import React, {useCallback, useState, useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import Header from "../../../components/atoms/Header";
import Card from "../../../components/layouts/Card";
import SearchBarPreview from "../../../components/molecules/SearchBarPreview";
import SmartVisionResultPreview from "../../../components/organisms/SmartVisionResultPreview";
import {Modal} from "reactstrap";
import {mapProduct} from "../../../components/organisms/WidgetPreview";
import {TRAINING_STATUS} from "../../../utils/enums";


const INITIAL_CONFIG = {
  enabled: false,
  buttonIconUrl: 'https://delvify-recommendations-vendors.s3-ap-southeast-1.amazonaws.com/smart_vision_icon_1.svg',
  headerText: {
    enabled: true,
    color: '#000000',
    fontSize: 30,
    family: 'Default',
  },
  uploadText: {
    enabled: true,
    color: '#000000',
    fontSize: 15,
    family: 'Default',
  },
};

const mapStateToProps = (state) => ({
  me: window._.get(state, ['auth', 'user'], {})
});

const SmartVision = (props) => {
  const { me } = props;
  const [trainingStatus, setTrainingStatus] = useState(TRAINING_STATUS.INIT);
  const [modalOpen, setModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);

  useEffect(() => {
    getTrainingStatus();
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

  const onFileUpload = useCallback(async (file) => {
    try {
      if (file) {
        setLoading(true);
        setImage(URL.createObjectURL(file));
        setModalOpen(true);
        const results = await searchImage(file);
        console.log(results);
        setResult(results);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setResult([]);
      setLoading(false);
    }
  }, []);


  const searchImage = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const skus = (await (await fetch(`${process.env.REACT_APP_API_HOST}/fs/imageSearch/${me.username}`, { method: 'POST', body: formData })).json())['skus'];
      return (await (await fetch(`${process.env.REACT_APP_GET_PRODUCTS_API}/${me.username}?sku=${skus.join(',')}`)).json()).map(mapProduct);
    } catch (e) {
      console.log(e);
    }
  }, []);


  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  return (
    <div>
      {
        trainingStatus === TRAINING_STATUS.INIT ? null :
          trainingStatus === TRAINING_STATUS.COMPLETED ?
            <Card>
              <Header title="SMART Vision" size="lg">Upload a picture to test.</Header>
              <SearchBarPreview className="mt-3 mb-4" onFileUpload={onFileUpload}/>
            </Card> :
            <Card>
              <Header title="Your training in under process."/>
            </Card>
      }
      <Modal isOpen={modalOpen} size="xl" toggle={toggleModal}>
        <SmartVisionResultPreview noBackground onFileUpload={onFileUpload} image={image} loading={loading} result={result} onClose={toggleModal}/>
      </Modal>
    </div>
  );
};

export default connect(mapStateToProps)(SmartVision);
