// @mui material components
import { Autocomplete, Divider, List, ListItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import borders from 'assets/theme/base/borders';

// Waev Dashboard components
import { Header, MDBox, MDTypography, MDInput } from 'components';

import { DashboardLayout } from 'components/LayoutContainers/DashboardLayout';
import { DashboardNavbar } from 'components/Navbars/DashboardNavbar/DashboardNavbar';
import colors from 'assets/theme/base/colors';

import { CopyBlock, dracula } from 'react-code-blocks';
import { Link } from 'react-router-dom';
// JSBlob page components

interface CodeBlobProps {
  language?: string;
}

export function CodeBlob({ language = 'javascript' }: CodeBlobProps): JSX.Element {
  const { borderRadius } = borders;
  const { white } = colors;

  const JsBlobText = `<script src="https://cdn-development.waevdata.com/waev.js"></script>`;
  const JsBlobText2 = `<script type="text/javascript">
new Waev("DEPLOYMENT_ID", "API_KEY", "#testFormSubmit" );
</script>`;

  //Code Selector to be added later:
  // const codeSelectDropdown = (
  //   <Autocomplete
  //     fullWidth
  //     defaultValue={selectedLanguage}
  //     disableClearable
  //     value={selectedLanguage}
  //     options={Languages}
  //     onChange={handleChange}
  //     size="medium"
  //     renderInput={(params) => <MDInput {...params} label="Value" />}
  //   />
  // );
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={11.5}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Header
                    avatar="integration_instructions"
                    title="Documentation"
                    // actionsSection={codeSelectDropdown}
                  />
                  <MDBox>
                    <Grid item xs={12} pt={3} pl={3}>
                      <MDBox mb={1}>
                        <MDTypography variant="h5">{'Waev Integrations'}</MDTypography>
                      </MDBox>
                      <Divider />
                      <MDBox mb={2}>
                        <MDTypography variant="body2" pb={2}>
                          {'Easily ingest data across platforms'}
                        </MDTypography>
                      </MDBox>
                      <MDTypography variant="h5">Implementation </MDTypography>
                      <Divider />
                      <MDTypography variant="body2">
                        {`For standard forms, in order to start ingesting data through Waev:`}
                      </MDTypography>

                      <List sx={{ listStyleType: 'disc', pl: 4, pt: 2 }}>
                        <ListItem sx={{ display: 'list-item', color: white.main }}>
                          <MDTypography variant="body2">
                            {`Add the `}
                            {
                              <code
                                style={{
                                  background: 'rgb(40, 42, 54)',
                                  borderRadius: borderRadius.md,
                                }}
                              >{`./lib/bundle.js`}</code>
                            }
                            {` file to your site in a directory that is easily accessible.`}
                          </MDTypography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', color: white.main }}>
                          <MDTypography variant="body2">
                            {`Add the script to your html, such as `}
                            {
                              <code
                                style={{
                                  background: 'rgb(40, 42, 54)',
                                  borderRadius: borderRadius.md,
                                }}
                              >{`<script src="./bundle.js"></script>`}</code>
                            }
                            {` OR just add the script to your html with the proper CDN url for the desired package, such as`}{' '}
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
                            {`Create/find your Api Key and Deployment Id on the `}
                            {
                              <Link to="/deployments">
                                <MDTypography
                                  component="span"
                                  variant="body2"
                                  fontWeight="regular"
                                  color="info"
                                >
                                  {'Waev Deployments Page'}
                                </MDTypography>
                              </Link>
                            }
                            {`. Be sure that your configurations are correct on this page as well.`}
                          </MDTypography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', color: white.main }}>
                          <MDTypography variant="body2">
                            {`For the form you wish to ingest, find the html's form id. (Ex. `}
                            {
                              <code
                                style={{
                                  background: 'rgb(40, 42, 54)',
                                  borderRadius: borderRadius.md,
                                }}
                              >{`<form id="testFormSubmit">`}</code>
                            }
                            {`).`}
                          </MDTypography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', color: white.main }}>
                          <MDTypography variant="body2">
                            {`In another script tag in your html, instantiate the Waev class with the Deployment Id, Api Key, and Form ID.`}
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
                      <MDTypography variant="h5">Viewing Records</MDTypography>
                      <Divider />
                      <MDTypography variant="body2">
                        To see if the form is ingesting properly, you can visit your{' '}
                        {
                          <Link to="/data/view-data">
                            <MDTypography
                              component="span"
                              variant="body2"
                              fontWeight="regular"
                              color="info"
                            >
                              {'Waev Records Page'}
                            </MDTypography>
                          </Link>
                        }
                        .
                      </MDTypography>
                    </Grid>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
