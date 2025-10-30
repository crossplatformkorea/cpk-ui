import type {ComponentProps} from 'react';
import {SafeAreaView} from 'react-native';
import {styled, css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {useCPK} from '../../../providers';
import {Typography} from '../../uis/Typography/Typography';
import {Button} from '../../uis/Button/Button';
import AlertDialog from './AlertDialog';

const Container = styled(SafeAreaView)`
  background-color: ${({theme}) => theme.bg.basic};
`;

function AlertDialogBasicStory(): React.JSX.Element {
  const {alertDialog} = useCPK();

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
      <Typography.Title>AlertDialog</Typography.Title>
      <Button
        color="primary"
        onPress={() =>
          alertDialog.open({
            title: 'Hello there!',
            body: 'This is an alert dialog.',
          })
        }
        style={{marginTop: 60, width: 200}}
        text="Dialog"
      />
      <Button
        color="primary"
        onPress={() =>
          alertDialog.open({
            title: 'Hello there!',
            body: 'This is an alert dialog.',
            actions: [
              <Button
                color="light"
                key="button-cancel"
                onPress={() => alertDialog.close()}
                text="Cancel"
              />,
              <Button
                key="button-ok"
                onPress={() => alertDialog.close()}
                text="OK"
              />,
            ],
          })
        }
        style={{marginTop: 20, width: 200}}
        text="With actions"
      />
    </Container>
  );
}

const meta = {
  title: 'AlertDialog',
  component: AlertDialogBasicStory,
  decorators: [withThemeProvider],
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
