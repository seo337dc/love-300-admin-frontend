import { extendTheme } from '@mui/joy/styles';
import { deepmerge } from '@mui/utils';
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles';
import colors from '@mui/joy/colors';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';

declare module '@mui/joy/styles' {
  interface PaletteBackground {
    appBody: string;
    componentBg: string;
    backdrop: string;
  }
  interface PaletteNeutral {
    outlinedDisabledColor: string;
  }
}
const joyTheme = extendTheme({
  components: {
    JoySheet: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--joy-palette-background-componentBg)'
        }
      }
    },
    JoyInput: {
      styleOverrides: {
        root: {
          '&.Joy-disabled': {

          }
        }
      }
    }
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: colors.purple[50],
          100: colors.purple[100],
          200: colors.purple[200],
          300: colors.purple[300],
          400: colors.purple[400],
          500: colors.purple[500],
          600: colors.purple[600],
          700: colors.purple[700],
          800: colors.purple[800],
          900: colors.purple[900],
        },
        background: {
          appBody: 'var(--joy-palette-neutral-50)',
          componentBg: 'var(--joy-palette-common-white)',
          backdrop: 'rgba(255 255 255 / 0.5)'
        },
        neutral: {
          outlinedDisabledColor: 'var(--joy-palette-neutral-outlinedColor)',
          plainDisabledColor: 'var(--joy-palette-neutral-plainColor)',
          // outlinedDisabledColor: 'var(--joy-palette-neutral-500)',
          // plainDisabledColor: 'var(--joy-palette-neutral-500)',
        }
      },
    },
    dark: {
      palette: {
        primary: {
          50: colors.purple[50],
          100: colors.purple[100],
          200: colors.purple[200],
          300: colors.purple[300],
          400: colors.purple[400],
          500: colors.purple[500],
          600: colors.purple[600],
          700: colors.purple[700],
          800: colors.purple[800],
          900: colors.purple[900],
        },
        background: {
          appBody: 'var(--joy-palette-common-black)',
          // componentBg: 'var(--joy-palette-background-level1)',
          componentBg: 'var(--joy-palette-neutral-900)',
          backdrop: 'rgba(var(--joy-palette-neutral-darkChannel) / 0.5)'
        },
        neutral: {
          outlinedDisabledColor: 'var(--joy-palette-neutral-outlinedColor)',
          plainDisabledColor: 'var(--joy-palette-neutral-plainColor)',
        }
      },
    },
  },
  fontFamily: {
    // display: "'Roboto Flex', var(--joy-fontFamily-fallback)",
    // body: "'Inter', var(--joy-fontFamily-fallback)",
  }
});

const muiTheme = extendMuiTheme({
  cssVarPrefix: 'joy',
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeMedium: {
          fontSize: '1.5rem'
        },
        fontSizeLarge: {
          fontSize: '3rem'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: joyTheme.radius.sm,
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        row: {
          borderBottom: "1px solid",
          borderColor: 'var(--joy-palette-divider)'
        },
        columnHeader: {
          borderBottom: "1.3px solid",
          borderColor: 'var(--joy-palette-divider)'
        },
        columnHeaderTitle: {
          fontSize: joyTheme.fontSize.sm,
          lineHeight: joyTheme.lineHeight.md,
          fontWeight: '600',
          color: 'var(--joy-palette-text-primary);'
          // color: 'var(--joy-palette-text-tertiary);'
        },
        cellContent: {
          fontSize: joyTheme.fontSize.sm,
          lineHeight: joyTheme.lineHeight.md,
          color: 'var(--joy-palette-text-primary);',
          fontWeight: '400',
        }
      }
    },
    MuiCollapse: {
      styleOverrides: {
        wrapper: {
          backgroundColor: 'var(--joy-palette-background-componentBg)'
        }
      }
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: colors.purple[500],
        },
        grey: colors.grey,
        error: {
          main: colors.red[500],
        },
        info: {
          main: colors.blue[500],
        },
        success: {
          main: colors.green[500],
        },
        warning: {
          main: colors.yellow[200],
        },
        common: {
          white: '#FFF',
          black: '#09090D',
        },
        divider: colors.grey[200],
        text: {
          primary: colors.grey[800],
          secondary: colors.grey[600],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: colors.purple[400],
        },
        grey: colors.grey,
        error: {
          main: colors.red[600],
        },
        info: {
          main: colors.blue[600],
        },
        success: {
          main: colors.green[600],
        },
        warning: {
          main: colors.yellow[300],
        },
        common: {
          white: '#FFF',
          black: '#09090D',
        },
        divider: colors.grey[800],
        text: {
          primary: colors.grey[100],
          secondary: colors.grey[300],
        },
      },
    },
  },
});
const theme = deepmerge(muiTheme, joyTheme);

export default theme;
