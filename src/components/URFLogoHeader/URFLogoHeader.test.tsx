import React from 'react';
import URFLogoHeader from './index';
import { render } from 'react-testing-library';

test('Logo has svg', () => {
  const { container } = render(<URFLogoHeader />);

  expect(container).toMatchSnapshot();
});
