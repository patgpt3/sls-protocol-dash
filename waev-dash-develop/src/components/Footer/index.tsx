// Waev Dashboard components
import { MDBox, MDTypography } from 'components';
import { Link } from '@mui/material';

// Waev Dashboard Base Styles
import typography from 'assets/theme/base/typography';

export function Footer(): JSX.Element {
  const { size } = typography;
  return (
    <MDBox
      width="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
      flexDirection="column"
      flex={1}
    >
      <MDBox flex="1 0 auto"></MDBox>
      <MDBox
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
        flexShrink={0}
      >
        <Link target="_blank" href="https://waevdata.com/terms/">
          <MDTypography
            variant="caption"
            fontWeight="bold"
            color="info"
            textGradient
            fontSize={size.sm}
          >
            Terms of Use&nbsp;
          </MDTypography>
        </Link>
        &&nbsp;
        <Link target="_blank" href="https://waevdata.com/privacy/">
          <MDTypography
            variant="caption"
            fontWeight="bold"
            color="info"
            textGradient
            fontSize={size.sm}
          >
            Privacy Policy&nbsp;
          </MDTypography>
        </Link>
        Waev &copy; {new Date().getFullYear()}
      </MDBox>
      {/* <ContentModal
        isOpen={isTermsOpen}
        setIsOpen={setIsTermsOpen}
        title="Terms and Conditions"
        primaryText="Dismiss"
        onPrimaryClick={() => setIsTermsOpen(false)}
      >
        <TermsAndConditions />
      </ContentModal> */}
    </MDBox>
  );
}
