// Waev Dashboard Base Styles
import colors from 'assets/theme-dark/base/colors';

const { info, dark, grey } = colors;

const globals = {
  html: {
    scrollBehavior: 'smooth',
    height: '100%',
  },
  '&::-webkit-scrollbar': {
    backgroundColor: 'transparent',
    maxWidth: '9px',
    maxHeight: '9px',
  },
  '&::-webkit-scrollbar-corner': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: grey[700],
    borderRadius: "45px",
  },
  body: {
    height: '100%',
  },
  '#root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  '*, *::before, *::after': {
    margin: 0,
    padding: 0,
  },
  'a, a:link, a:visited': {
    textDecoration: 'none !important',
  },
  'a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited': {
    color: `${dark.main} !important`,
    transition: 'color 150ms ease-in !important',
  },
  'a.link:hover, .link:hover, a.link:focus, .link:focus': {
    color: `${info.main} !important`,
  },
};

export default globals;
