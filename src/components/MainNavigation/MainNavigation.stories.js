import React from 'react';
import { storiesOf } from '@storybook/react';
import MainNavigation from './index';
import { MemoryRouter } from 'react-router';

storiesOf('MainNavigation', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('', () => (
    <div>
      <MainNavigation desktop />
      <MainNavigation mobile />
    </div>
  ));
