import React from 'react';
import URFLogoHeader from '../../src/components/URFLogoHeader';
import { render } from 'react-testing-library';

test('Logo has svg', () => {
  const { container } = render(
    <URFLogoHeader />
  );

  expect(container).toMatchSnapshot();
});
