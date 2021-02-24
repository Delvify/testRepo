import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import { Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import awsConfig from '../../../aws-exports';

import {CustomInput} from 'reactstrap';
import Header from "../../../components/atoms/Header";
import Card from "../../../components/layouts/Card";
import SmartVisionIconConfiguration from "../../../components/organisms/SmartVisionIconConfiguration";
import SmartVisionPopupConfiguration from "../../../components/organisms/SmartVisionPopupConfiguration";


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
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [uploadedIcons, setUploadedIcons] = useState([]);
  const [identityId, setIdentityId] = useState(null);

  useEffect(() => {
    getIdentityId();
    getConfig();
  }, []);

  useEffect(() => {
    if (identityId) {
      getUploadedIcons();
    }
  }, [identityId]);

  const iconKeyToPath = useCallback((key) => {
    return `https://${awsConfig.aws_user_files_s3_bucket}.s3-${awsConfig.aws_user_files_s3_bucket_region}.amazonaws.com/protected/${identityId}/${key}`;
  }, [identityId]);

  const iconPathToKey = useCallback((path) => {
    const paths = path.split('/');
    return paths[paths.length - 1];
  }, []);

  const getIdentityId = useCallback(async () => {
    const { identityId } = await Auth.currentCredentials();
    setIdentityId(identityId);
  }, []);

  const getConfig = useCallback(async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(queries.getUser, { id: me.username }));
      const config = window._.get(data, ['getUser', 'smartVision'], null);
      if (config) {
        const mergedConfig = window._.mergeWith(INITIAL_CONFIG, config, (initValue, srcValue) => {
          if (srcValue === null || srcValue === undefined) return initValue;
          return srcValue;
        });
        setConfig({...mergedConfig});
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getUploadedIcons = useCallback(async () => {
    try {
      const result = await Storage.list('uploaded_icons/', { level: 'protected' });
      setUploadedIcons(result.map((icon) => iconKeyToPath(icon.key)));
    } catch (e) {
      console.log(e);
    }
  }, [identityId]);

  const toggleSmartVision = useCallback(async () => {
    await onSave({ enabled: !config.enabled });
  }, [config]);

  const onSaveIcon = useCallback(async (icon) => {
    await onSave({ buttonIconUrl: icon });
  }, [config]);

  const onIconRemove = useCallback(async (icon) => {
    try {
      const result = await Storage.remove(`uploaded_icons/${iconPathToKey(icon)}`, {
        level: 'protected',
      });
      setUploadedIcons(uploadedIcons.filter((uploadedIcon) => uploadedIcon !== icon));
    } catch(e) {
      console.log(e);
    }
  }, [uploadedIcons, config]);

  const onSavePopup = useCallback(async (fontConfig) => {
    await onSave(fontConfig);
  }, [config]);

  const onSave = useCallback(async (delta) => {
    const newConfig = { ...config, ...delta };
    setConfig(newConfig);
    const result = await API.graphql(graphqlOperation(mutations.updateUser, { input: { id: me.username, smartVision: newConfig } }));
    console.log(result);
  }, [config]);

  const onFileUpload = useCallback(async (file) => {
    try {
      if (file) {
        const { key } = await Storage.put(`uploaded_icons/${file.name}`, file, {
          level: 'protected',
          contentType: file.type,
        });
        setUploadedIcons([...uploadedIcons, iconKeyToPath(key)]);
      }
    } catch (e) {
      console.log(e);
    }
  }, [uploadedIcons, identityId]);

  return (
    <div>
      <div className="configuration-header">
        <Header
          title={"SMART Vision Settings"}
          type="main"
        >
          While we train your AI model, please configure your SMART Vision settings and design.<br/>
          <i className="fa fa-question-circle"/> For configuration or design requirements, please reach out to your Account Manager.
        </Header>
        <Card>
          <Header
            title="SMART Vision"
            size="lg"
            Button={<CustomInput
              id='smartVisionToggle'
              type="switch"
              onChange={toggleSmartVision}
              checked={config.enabled}
            />}>
            When enabled, your customers can upload or take a photo to find products using Visual AI technology. SMART Vision powers your customers product discovery, improving customer experience, and increases revenue.
          </Header>
        </Card>
        <SmartVisionIconConfiguration buttonIconUrl={config.buttonIconUrl} buttonIcons={uploadedIcons} onSave={onSaveIcon} onFileUpload={onFileUpload} onRemove={onIconRemove}/>
        <SmartVisionPopupConfiguration fontConfig={{ headerText: config.headerText, uploadText: config.uploadText }} onSave={onSavePopup} />
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(SmartVision);
