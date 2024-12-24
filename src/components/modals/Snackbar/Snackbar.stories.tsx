import type {ComponentProps} from 'react';
import styled, {css} from '@emotion/native';
import type {Meta, StoryObj} from '@storybook/react';
import {useCPK} from '../../../providers';
import {Typography} from '../../uis/Typography/Typography';
import {Button} from '../../uis/Button/Button';
import {withThemeProvider} from '../../../../.storybook/decorators';
import Snackbar from './Snackbar';

const Container = styled.SafeAreaView`
  background-color: ${({theme}) => theme.bg.basic};
`;

function SnackbarBasicStory(): JSX.Element {
  const {snackbar} = useCPK();

  return (
    <Container
      style={css`
        flex-direction: column;
        padding: 48px 24px;
        align-self: stretch;
        justify-content: center;
        align-items: center;
      `}
    >
      <Typography.Title>Snackbar</Typography.Title>
      <Button
        color="primary"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
          })
        }
        style={{marginTop: 60, width: 200}}
        text="Snackbar"
      />
      <Button
        color="primary"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            actionText: 'Cancel',
          })
        }
        style={{marginTop: 20, width: 200}}
        text="With action"
      />
      <Button
        color="info"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            color: 'info',
          })
        }
        style={{marginTop: 20, width: 200}}
        text="Color = info"
      />
      <Button
        color="danger"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            color: 'danger',
          })
        }
        style={{marginTop: 20, width: 200}}
        text="Color = danger"
      />
      <Button
        color="light"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            color: 'light',
          })
        }
        style={{marginTop: 20, width: 200}}
        text="Color = light"
      />
    </Container>
  );
}

const meta = {
  title: 'Snackbar',
  component: SnackbarBasicStory,
  decorators: [withThemeProvider],
} satisfies Meta<typeof Snackbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
