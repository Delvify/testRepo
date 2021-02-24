import React, {useCallback, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import Overview from "../Overview";
import {Divider, Button} from "../../components/atoms";
import { Link } from 'react-router-dom';
import {API, graphqlOperation} from "aws-amplify";
import * as queries from "../../graphql/queries";
import styled from "@emotion/styled";
import { color } from '../../utils/styleVariables';
import Card from "../../components/layouts/Card";
import Header from "../../components/atoms/Header";
import ActionCard from "../../components/layouts/ActionCard";

const mapStateToProps = (state) => ({
  me: window._.get(state, ['auth', 'user'], {}),
  name: window._.get(state, ['auth', 'user', 'attributes', 'name'], null)
});

const PageHeader = styled(Header)({
  textAlign: 'center',
  marginTop: '60px',
  marginBottom: '97px',
  fontSize: '3.48vw',
  lineHeight: '4.3vw',
  fontWeight: 'bold',
  color: color.text.white,
});

const StyledCard = styled(Card)({
  marginBottom: '50px',
});

const StyledHeader = styled(Header)({
  marginBottom: '48px',
  marginTop: '16px',
});

const ActionCardWrapper = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  columnGap: '4.1%',
  '&>div': {
    flex: 1,
  }
});

const Onboarding = (props) => {
  const { me, name } = props;
  const [step, setStep] = useState([false, false]);

  useEffect(() => {
    getUser();
  }, []);
  const getUser = useCallback(async () => {
    const { data: userData } = await API.graphql(graphqlOperation(queries.getUser, { id: me.username }));
    const widgets = window._.get(userData, ['getUser', 'smartSKU', 'widgets'], []);
    const smartVision = window._.get(userData, ['getUser', 'smartVision'], null);
    const file = window._.get(userData, ['getUser', 'file'], null);
    setStep([!!file, widgets.length > 0 || smartVision]);
  }, []);
  return (
    <div className="animated fadeIn">
      <PageHeader>Hello {name}.<br/>Welcome to SMART Platform.</PageHeader>
      <StyledCard>
        <StyledHeader title='Getting Started' size='xl'/>
        <ActionCardWrapper>
          <ActionCard
            title='Guide to Smart Platform'
            description={`This document has all the information you need to implement Delvify's ECommerce AI Solutions.`}
            buttonLabel={'View Guide'}
            to={'https://docs.delvify.io/'}
          />
          <ActionCard
            title='Any questions?'
            description={`If you require further assistance or need more information, please contact your Account Manager.`}
            buttonLabel={'Contact'}
            to={'https://delvify.ai/get-started/'}
          />
        </ActionCardWrapper>
      </StyledCard>
      <Card>
        <StyledHeader title='What’s Next' size='xl'/>
        <ActionCardWrapper>
          <ActionCard
            subTitle={'Step 1'}
            title='Upload Product Feed Data'
            description={`Once uploaded, training the AI model takes up to 2 days to complete.`}
            buttonLabel={'Upload'}
            to={'/upload'}
            checked={step[0]}
          />
          <ActionCard
            subTitle={'Step 2'}
            title='Configure AI Solutions'
            description={`Update your recommendation widget settings and design.`}
            buttons={[
              { buttonLabel: 'Smart SKU', to: '/config/smart-sku' },
              { buttonLabel: 'Smart Vision', to: '/config/smart-vision' },
            ]}
            checked={step[1]}
          />
          <ActionCard
            subTitle={'Step 3'}
            title='Deploy and Activate'
            description={`Activate the personalized AI product recommendations for your users.`}
            buttonLabel={'Deploy'}
            to={'/deploy'}
          />
        </ActionCardWrapper>
      </Card>
    </div>
  )
};

export default connect(mapStateToProps)(Onboarding);
