import { Link, List, ListItem } from '@mui/material';
import colors from 'assets/theme/base/colors';
import { MDBox, MDTypography } from 'components';

interface TypeformDocsProps {
  language?: string;
}

export function TypeformDocs({ language = 'javascript' }: TypeformDocsProps): JSX.Element {
  const { white } = colors;

  return (
    <MDBox>
      <MDTypography variant="body2">
        For those using{' '}
        <Link target="_blank" href="https://www.typeform.com">
          <MDTypography
            variant="body"
            fontWeight="bold"
            color="info"
            textGradient
            // fontSize={size.sm}
          >
            Typeform Forms
          </MDTypography>
        </Link>
        , in order to start ingesting data through Waev:
      </MDTypography>

      <List sx={{ listStyleType: 'disc', pl: 4, pt: 2 }}>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">
            Create a new Personal Token using{' '}
            <Link target="_blank" href="https://admin.typeform.com/user/tokens">
              <MDTypography
                variant="body"
                fontWeight="bold"
                color="info"
                textGradient
                // fontSize={size.sm}
              >
                Typeform Personal Tokens
              </MDTypography>
            </Link>
            , and click the "Generate a new token" button.
          </MDTypography>
        </ListItem>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">
            Add a token name of anything you'd like, such as "Waev Typeform Token"
          </MDTypography>
        </ListItem>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">
            Select the "Webhooks: read" scope and generate the token.
          </MDTypography>
        </ListItem>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">Input the token here...</MDTypography>
        </ListItem>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">Once </MDTypography>
        </ListItem>
      </List>
    </MDBox>
  );
}
