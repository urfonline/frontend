import { configure, setAddon } from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import '../src/css/screen.css';

setAddon(infoAddon);

const req = require.context('../src', true, /.stories.js$/);

configure(() => {
  req.keys().forEach(filename => req(filename));
}, module);
