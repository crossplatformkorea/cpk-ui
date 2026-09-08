import {useState} from 'react';
import {Text, View} from 'react-native';
import {css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {Accordion} from './Accordion';
import {Button} from '../Button/Button';
import {withThemeProvider} from '../../../../.storybook/decorators';

const ACCORDION_DOCS =
  'Groups related sections behind disclosure controls. Use defaultExpandedIndexes for intentional initial disclosure; avoid expanding every section when the content is long.';

const meta = {
  title: 'Display/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: ACCORDION_DOCS,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24],
      description:
        'Accordion size: "small" (40px title), "medium" (48px title), "large" (56px title), or custom number',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultData = [
  {
    title: 'Installation',
    items: ['Package manager', 'Peer dependencies', 'Provider setup'],
  },
  {
    title: 'Theming',
    items: ['Color roles', 'Light and dark modes', 'Custom tokens'],
  },
  {
    title: 'Platform behavior',
    items: ['iOS', 'Android', 'Web'],
  },
];

export const Basic: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    collapseOnStart: true,
    onPressItem: () => {},
    data: defaultData,
    shouldAnimate: true,
  },
};

export const FirstItemExpanded: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    defaultExpandedIndexes: [0],
    onPressItem: () => {},
    data: defaultData,
    shouldAnimate: true,
  },
};

export const MultipleItemsExpanded: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    defaultExpandedIndexes: [0, 2],
    onPressItem: () => {},
    data: defaultData,
    shouldAnimate: true,
  },
};

export const AllItemsExpanded: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    expandAllOnStart: true,
    onPressItem: () => {},
    data: defaultData,
    shouldAnimate: true,
  },
};

function ControlledActionsExample() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Accordion
      data={[{title: 'Meal', items: ['Actions']}]}
      expandedIndexes={expanded ? [0] : []}
      onExpandedChange={(_, open) => setExpanded(open)}
      renderHeader={({title, toggle}) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
          }}
        >
          <Text>{title}</Text>
          <Button text="More" type="text" onPress={toggle} />
        </View>
      )}
      renderItem={() => (
        <View style={{flexDirection: 'row', gap: 8}}>
          <Button text="Edit" type="text" />
          <Button text="Archive" type="text" color="danger" />
        </View>
      )}
      styles={{
        container: {borderRadius: 16, borderWidth: 1, borderColor: '#dfe3ec'},
      }}
    />
  );
}

export const ControlledActions: Story = {
  args: {data: defaultData},
  render: () => <ControlledActionsExample />,
};
