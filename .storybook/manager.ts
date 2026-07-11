import {addons} from '@storybook/manager-api';

import {cpkStorybookTheme} from './theme';

addons.setConfig({
  enableShortcuts: true,
  panelPosition: 'right',
  showToolbar: true,
  theme: cpkStorybookTheme,
});
