import { List, ListItem } from '@mui/material';
import borders from 'assets/theme/base/borders';
import colors from 'assets/theme/base/colors';
import { MDBox, MDTypography } from 'components';
import { CopyBlock, dracula } from 'react-code-blocks';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'utils';

interface StandardWebDocsProps {
  language?: string;
}

export function StandardWebDocs({ language = 'javascript' }: StandardWebDocsProps): JSX.Element {
  const { borderRadius } = borders;
  const { white } = colors;

  const JsBlobText = `<script src="https://cdn.waevdata.com/waev.js"></script>`;
  const JsBlobText2 = `<script type="text/javascript">
new Waev("DEPLOYMENT_ID", "API_KEY", "#testFormSubmit" );
</script>`;

  return (
    <MDBox>
      <MDTypography variant="body2">
        <FormattedMessage
          id="documentation.web.docs.description"
          defaultMessage="For standard forms, in order to start ingesting data through Waev:"
        />
      </MDTypography>

      <List sx={{ listStyleType: 'disc', pl: 4, pt: 2 }}>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">
            <FormattedMessage id="documentation.web.docs.bullet1.part1" defaultMessage="Add the" />{' '}
            {
              <code
                style={{
                  background: 'rgb(40, 42, 54)',
                  borderRadius: borderRadius.md,
                }}
              >
                {`./lib/bundle.js`}
              </code>
            }{' '}
            <FormattedMessage
              id="documentation.web.docs.bullet1.part2"
              defaultMessage="file to your site in a directory that is easily accessible."
            />
          </MDTypography>
        </ListItem>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">
            <FormattedMessage
              id="documentation.web.docs.bullet2.part1"
              defaultMessage="Add the script to your html, such as"
            />{' '}
            {
              <code
                style={{
                  background: 'rgb(40, 42, 54)',
                  borderRadius: borderRadius.md,
                }}
              >
                {`<script src="./bundle.js"></script>`}
              </code>
            }{' '}
            <FormattedMessage
              id="documentation.web.docs.bullet2.part2"
              defaultMessage="OR just add the script to your html with the proper CDN url for the desired package,
			  such as"
            />{' '}
          </MDTypography>
        </ListItem>
      </List>
      <MDBox
        m={5}
        sx={{
          maxHeight: '60vh',
          overflow: 'auto',
          fontSize: 'smaller',
          backgroundColor: 'rgb(40, 42, 54)',
          borderRadius: borderRadius.md,
          '&::-webkit-scrollbar': {
            width: '0.6em',
            height: '0.6em',
            backgroundColor: 'rgba(40, 42, 54,.5)',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            backgroundColor: 'rgba(0,0,0,.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(26, 115, 232,.5)',
            // outline: '1px solid slategrey'
          },
          span: { overflowX: 'unset !important' },
        }}
      >
        <CopyBlock
          text={JsBlobText}
          codeBlock
          showLineNumbers={false}
          language={language}
          theme={dracula}
        />
      </MDBox>
      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">
            <FormattedMessage
              id="documentation.web.docs.bullet3.part1"
              defaultMessage="Create/find your Api Key and Deployment Id on the"
            />{' '}
            {
              <Link to="/deployments">
                <MDTypography component="span" variant="body2" fontWeight="regular" color="info">
                  <FormattedMessage
                    id="documentation.web.docs.deployments.link"
                    defaultMessage="Waev Deployments Page"
                  />
                </MDTypography>
              </Link>
            }
            {'. '}
            <FormattedMessage
              id="documentation.web.docs.bullet3.part2"
              defaultMessage="Be sure that your configurations are correct on this page as well."
            />
          </MDTypography>
        </ListItem>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">
            <FormattedMessage
              id="documentation.web.docs.bullet4"
              defaultMessage="For the form you wish to ingest, find the html's form id. (Ex."
            />{' '}
            {
              <code
                style={{
                  background: 'rgb(40, 42, 54)',
                  borderRadius: borderRadius.md,
                }}
              >{`<form id="testFormSubmit">`}</code>
            }
            {' ).'}
          </MDTypography>
        </ListItem>
        <ListItem sx={{ display: 'list-item', color: white.main }}>
          <MDTypography variant="body2">
            <FormattedMessage
              id="documentation.web.docs.bullet5"
              defaultMessage="In another script tag in your html, instantiate the Waev class with the Deployment Id, Api Key, and Form ID."
            />
          </MDTypography>
        </ListItem>
      </List>
      <MDBox
        m={5}
        sx={{
          maxHeight: '60vh',
          overflow: 'auto',
          fontSize: 'smaller',
          backgroundColor: 'rgb(40, 42, 54)',
          borderRadius: borderRadius.md,
          '&::-webkit-scrollbar': {
            width: '0.6em',
            height: '0.6em',
            backgroundColor: 'rgba(40, 42, 54,.5)',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            backgroundColor: 'rgba(0,0,0,.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(26, 115, 232,.5)',
            // outline: '1px solid slategrey'
          },
          span: { overflowX: 'unset !important' },
        }}
      >
        <CopyBlock
          text={JsBlobText2}
          language={language}
          showLineNumbers={true}
          theme={dracula}
          wrapLines
          codeBlock
        />
      </MDBox>
    </MDBox>
  );
}
