import React from 'react';
import { storiesOf } from '@storybook/react';
import BroadcastingIcon from './index';

storiesOf('BroadcastingIcon', module)
  .add('animating', () =>
    <div style={{ background: 'black' }}>
      <div style={{ maxWidth: '100px' }}>
        <BroadcastingIcon animate={true} />
      </div>
    </div>
  );
