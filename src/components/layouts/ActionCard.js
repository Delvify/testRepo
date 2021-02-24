import * as React from 'react';
import styled from '@emotion/styled';
import Proptypes from 'prop-types';
import { color } from '../../utils/styleVariables';
import Button from "../atoms/Button";
import Link from "../atoms/Link";

const StyledCard = styled('div')({
    padding: '29px 2.36% 29px 2.36%',
    maxWidth: '360px',
    borderRadius: '5px',
    marginBottom: '37px',
    backgroundColor: color.background.light,
    border: `1px solid ${color.border.light}`,
    '&:hover': {
      backgroundColor: color.background.selected,
      border: `2px solid ${color.border.selected}`,
    }
});

const SubTitle = styled('div')({
  fontWeight: 500,
  fontSize: '15px',
  lineHeight: '18px',
  color: color.text.secondary,
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  '&>i': {
    color: color.text.success,
    marginLeft: '5px',
  }
});

const Header = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 12px;
`;

const Description = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: ${color.text.secondary};
  margin-bottom: 21px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  column-gap: 10px;
`;



const ActionCard = ({ className, onClick, buttonLabel, description, title, subTitle, checked, to, buttons }) => (
  <StyledCard className={className}>
    { (subTitle || checked) && <SubTitle>{ subTitle } { checked && <i className="fa fa-check-circle" /> }</SubTitle> }
    { !!title && <Header>{title}</Header> }
    { !!description && <Description>{description}</Description> }
    {
      buttons ?
        <ButtonWrapper>
          {
            buttons.map(({ to, onClick, buttonLabel }) => (
              to ? <Link to={to} key={`button_${buttonLabel}`}><Button>{buttonLabel}</Button></Link> :
                onClick ? <Button onClick={onClick}>{buttonLabel}</Button> : null
            ))
          }
        </ButtonWrapper> :
        to ? <Link to={to}><Button>{buttonLabel}</Button></Link> :
          onClick ? <Button onClick={onClick}>{buttonLabel}</Button> : null
    }
  </StyledCard>
);

ActionCard.propTypes  = {
  className: Proptypes.string,
  title: Proptypes.string,
  subTitle: Proptypes.string,
  buttonLabel: Proptypes.string,
  description: Proptypes.string,
  onClick: Proptypes.func,
  to: Proptypes.string,
  checked: Proptypes.bool,
};

export default ActionCard
