const baseColors = {
  success: '#1CD66C',
  warning: '#E2B101',
  danger: '#F84444',
  info: '#307EF1',
  accent: '#6BF3C5',
  link: '#A351F4',
};

const buttonColors = {
  light: {
    primary: {bg: '#1B1B1B', text: '#FFFFFF'},
    secondary: {bg: '#3D8BFF', text: '#FFFFFF'},
    success: {bg: '#1CD66C', text: '#FFFFFF'},
    danger: {bg: '#F84444', text: '#FFFFFF'},
    warning: {bg: '#E2B101', text: '#FFFFFF'},
    info: {bg: '#307EF1', text: '#FFFFFF'},
    light: {bg: '#E8E8E8', text: '#232323'},
    disabled: {bg: '#EDEDED', text: '#BEBEBE'},
  },
  dark: {
    primary: {bg: '#FFFFFF', text: '#000000'},
    secondary: {bg: '#3D8BFF', text: '#000000'},
    success: {bg: '#2FFA86', text: '#000000'},
    danger: {bg: '#FF3C3C', text: '#000000'},
    warning: {bg: '#F4CC3E', text: '#000000'},
    info: {bg: '#2998FF', text: '#000000'},
    light: {bg: '#313131', text: '#FFFFFF'},
    disabled: {bg: '#292929', text: '#474747'},
  },
};

const colors: {
  light: Partial<ThemeColors>;
  dark: Partial<ThemeColors>;
} = {
  light: {
    bg: {
      basic: '#FFFFFF',
      paper: '#EDEDED',
      disabled: '#BEBEBE',
    },
    role: {
      primary: '#1B1B1B',
      secondary: '#3D8BFF',
      success: baseColors.success,
      warning: baseColors.warning,
      danger: baseColors.danger,
      info: baseColors.info,
      accent: baseColors.accent,
      link: baseColors.link,
      border: '#CCCCCC',
      underlay: 'rgba(0, 0, 0, 0.16)',
      underlayContrast: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      basic: '#000000',
      label: '#4D4D4D',
      placeholder: '#787878',
      disabled: '#BEBEBE',
      validation: '#DA0000',
      contrast: '#FFFFFF',
    },
    button: buttonColors.light,
  },

  dark: {
    bg: {
      basic: '#242424',
      paper: '#1E1D1D',
      disabled: '#474747',
    },
    role: {
      primary: '#FFFFFF',
      secondary: '#3D8BFF',
      success: '#2FFA86',
      warning: '#F4CC3E',
      danger: '#FF3C3C',
      info: '#2998FF',
      accent: '#4AE3AD',
      link: baseColors.link,
      border: '#363636',
      underlay: 'rgba(255, 255, 255, 0.16)',
      underlayContrast: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      basic: '#FFFFFF',
      label: '#BEBEBE',
      placeholder: '#909090',
      disabled: '#6D6D6D',
      validation: '#FF2C2C',
      contrast: '#000000',
    },
    button: buttonColors.dark,
  },
};

type ThemeColors = {
  bg: {
    basic: string;
    paper: string;
    disabled: string;
  };
  role: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    accent: string;
    link: string;
    border: string;
    underlay: string;
    underlayContrast: string;
  };
  text: {
    basic: string;
    label: string;
    placeholder: string;
    disabled: string;
    validation: string;
    contrast: string;
  };
  button: {
    primary: {bg: string; text: string};
    secondary: {bg: string; text: string};
    success: {bg: string; text: string};
    danger: {bg: string; text: string};
    warning: {bg: string; text: string};
    info: {bg: string; text: string};
    light: {bg: string; text: string};
    disabled: {bg: string; text: string};
  };
};

const createTheme = (mode: 'light' | 'dark'): ThemeColors => {
  const themeColors = colors[mode];

  return {
    bg: themeColors.bg as ThemeColors['bg'],
    role: themeColors.role as ThemeColors['role'],
    text: themeColors.text as ThemeColors['text'],
    button: themeColors.button as ThemeColors['button'],
  };
};

export const light = createTheme('light');
export const dark = createTheme('dark');

export type Colors = typeof light;
