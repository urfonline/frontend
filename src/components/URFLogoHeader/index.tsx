import React from 'react';
import MobileLogo from '../../img/logotype-only-opt.svg';
import DesktopLogo from '../../img/logo-short-opt.svg';
import styled from '@emotion/styled';
import { queries } from '../../css/mq';
import { COLORS } from '../../css/constants';

const LogoContainer = styled.div`
  & > .desktop {
    display: none;
  }

  & > .mobile {
    height: 88px;
  }

  & > svg {
    width: 100%;

    g#letters > path {
      transition: fill .7s;
    }

    &:hover g#letters > path {
      &:nth-child(1) {
        fill: ${COLORS.BrandRed};
        transition-delay: 0s;
      }

      &:nth-child(2) {
        fill: ${COLORS.BrandRed};
        transition-delay: .2s;
      }

      &:nth-child(3) {
        fill: ${COLORS.BrandRed};
        transition-delay: .4s;
      }
    }
  }

  ${queries.medium`
    & > .mobile {
      display: none;
    }

    & > .desktop {
      display: initial;
    }
  `};
`;

const URFLogo = () => (
  <LogoContainer>
    <MobileLogo className="mobile"/>
    <DesktopLogo className="desktop"/>
  </LogoContainer>
);

export default URFLogo;
