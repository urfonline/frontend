import React from 'react';
import URFLogoHeader from '../../src/components/URFLogoHeader';
import renderer from 'react-test-renderer';

test('Logo has svg', () => {
  const component = renderer.create(
    <URFLogoHeader />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
