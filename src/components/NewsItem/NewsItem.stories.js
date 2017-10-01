import React from 'react';
import { storiesOf } from '@storybook/react';
import NewsItem from './index';

const testProps = {
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore...',
  date: '1 day ago',
};

const bestivalProps = {
  featured: true,
  title: 'Bestival Preview',
  description:
    "This year URF is heading to Bestival for a festival of colour, here's what you can expect over the 4 days...",
  date: '3 days ago',
};

storiesOf('NewsItem', module)
  .add('normal', () => (
    <div>
      <NewsItem title="Normal" featured={false} {...testProps} />
    </div>
  ))
  .add('featured', () => (
    <div>
      <NewsItem title="Featured" featured={true} {...testProps} />
    </div>
  ))
  .add('bestival-test', () => (
    <div>
      <NewsItem {...bestivalProps} />
    </div>
  ))
  .add('longer-title', () => (
    <div>
      <NewsItem
        title="This is what happens when there is a longer title"
        featured={true}
        {...testProps}
      />
    </div>
  ));

/**
 * Created by Fin on 25/06/2017.
 */
