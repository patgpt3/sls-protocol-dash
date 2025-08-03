import { Divider, List, ListItem } from '@mui/material';
import colors from 'assets/theme/base/colors';
import Grid from '@mui/material/Grid';
import { Fold, Header, MDBox, MDTypography } from 'components';
import { DashboardLayout } from 'components/LayoutContainers/DashboardLayout';
import { DashboardNavbar } from 'components/Navbars/DashboardNavbar/DashboardNavbar';
import { Link } from 'react-router-dom';
import { Integration } from 'types';
import { StandardWebDocs } from './StandardWebDocs';
import { defineMessages, useIntl, FormattedMessage } from 'utils';
import borders from 'assets/theme/base/borders';
// import { TypeformDocs } from './TypeformDocs';

const messages = defineMessages({
  title: {
    id: 'documentation.header.title',
    defaultMessage: 'Documentation',
  },
  webIntegration: {
    id: 'documentation.web.integration',
    defaultMessage: 'Web Integration',
  },
});

interface DocumentationProps {
  // language?: string;
}

export function Documentation({}: DocumentationProps): JSX.Element {
  const intl = useIntl();
  const { borderRadius } = borders;
  const { white } = colors;
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
                    title={intl.formatMessage(messages.title)}
                    // actionsSection={codeSelectDropdown}
                  />
                  <MDBox>
                    <Grid item xs={12} pt={3} pl={3}>
                      <MDBox mb={1}>
                        <MDTypography variant="h5">
                          <FormattedMessage
                            id="documentation.configuration.title"
                            defaultMessage="Waev Configuration"
                          />
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={1} mt={3}>
                        <MDTypography variant="body2" mb={1} ml={4}>
                          <FormattedMessage
                            id="documentation.configuration.intro.text"
                            defaultMessage="To set up a Waev deployment in the Waev Dashboard:
                            "
                          />
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={2} sx={{ pl: 4, py: 1 }}>
                        <List sx={{ listStyleType: 'disc', pl: 4 }}>
                          <ListItem sx={{ display: 'list-item', color: white.main }}>
                            <MDTypography variant="body2">
                              <FormattedMessage
                                id="documentation.configuration.bullet1"
                                defaultMessage="Add a new"
                              />{' '}
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`organization`}</code>
                              }
                              <FormattedMessage
                                id="documentation.configuration.bullet1.part2"
                                defaultMessage=" to your account in the settings page."
                              />
                            </MDTypography>
                          </ListItem>
                          <ListItem sx={{ display: 'list-item', color: white.main }}>
                            <MDTypography variant="body2">
                              <FormattedMessage
                                id="documentation.configuration.bullet2"
                                defaultMessage="Once you create an"
                              />{' '}
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`organization`}</code>
                              }
                              <FormattedMessage
                                id="documentation.configuration.bullet2.part2"
                                defaultMessage=", go to the Deployments page and add a "
                              />
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`deployment`}</code>
                              }
                              {'.'}
                            </MDTypography>
                          </ListItem>
                          <ListItem sx={{ display: 'list-item', color: white.main }}>
                            <MDTypography variant="body2">
                              <FormattedMessage
                                id="documentation.configuration.bullet3"
                                defaultMessage="To configure your "
                              />{' '}
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`deployment`}</code>
                              }
                              <FormattedMessage
                                id="documentation.configuration.bullet3.part2"
                                defaultMessage=", add each field you wish to collect data for in the private or public field inputs on the wizard. Make sure the field names are the same as the names of each respective input element in the form. (Note: you do not have to create fields for the specific flags (binary fields) you wish to write on-chain, those are configured separately once the deployment is created)."
                              />
                            </MDTypography>
                          </ListItem>
                          <ListItem sx={{ display: 'list-item', color: white.main }}>
                            <MDTypography variant="body2">
                              <FormattedMessage
                                id="documentation.configuration.bullet4"
                                defaultMessage="Select the field you wish to be the “user field” which is used to create the "
                              />{' '}
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{` Waev Connector `}</code>
                              }
                              <FormattedMessage
                                id="documentation.configuration.bullet4.part2"
                                defaultMessage=" that’s also written on-chain."
                              />
                            </MDTypography>
                          </ListItem>
                          <ListItem sx={{ display: 'list-item', color: white.main }}>
                            <MDTypography variant="body2">
                              <FormattedMessage
                                id="documentation.configuration.bullet5"
                                defaultMessage="Once you’ve created a deployment, go to the op-in fields section on the deployment page to configure your on-chain "
                              />{' '}
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`flags`}</code>
                              }
                              {'.'}
                            </MDTypography>
                          </ListItem>
                          <ListItem sx={{ display: 'list-item', color: white.main }}>
                            <MDTypography variant="body2">
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`Flag description`}</code>
                              }
                              <FormattedMessage
                                id="documentation.configuration.bullet6.part1"
                                defaultMessage=" is just a business abstraction for the Waev user to understand, the "
                              />
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`flag source field`}</code>
                              }
                              <FormattedMessage
                                id="documentation.configuration.bullet6.part2"
                                defaultMessage=" is the name that needs to match the input element in the form."
                              />
                            </MDTypography>
                          </ListItem>
                          <MDBox sx={{ pl: 4, py: 1 }}>
                            <ListItem sx={{ display: 'list-item', color: white.main }}>
                              <MDTypography variant="body2">
                                <FormattedMessage
                                  id="documentation.configuration.bullet7"
                                  defaultMessage="(Note: if you want a flag that's based on the input of a field that already exists, you can simply name the source field the same as field name and the flag binary will be based on that field input)"
                                />
                              </MDTypography>
                            </ListItem>
                          </MDBox>
                          <ListItem sx={{ display: 'list-item', color: white.main }}>
                            <MDTypography variant="body2">
                              <FormattedMessage
                                id="documentation.configuration.bullet8"
                                defaultMessage="Once you have a flag or flags, you can generate an "
                              />{' '}
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`API key`}</code>
                              }
                              <FormattedMessage
                                id="documentation.configuration.bullet8.part2"
                                defaultMessage=" and reveal your "
                              />
                              {
                                <code
                                  style={{
                                    background: 'rgb(40, 42, 54)',
                                    borderRadius: borderRadius.md,
                                  }}
                                >{`deployment ID`}</code>
                              }
                              {'.'}
                            </MDTypography>
                          </ListItem>
                        </List>
                      </MDBox>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" mb={4} ml={4}>
                          <FormattedMessage
                            id="documentation.configuration.end"
                            defaultMessage="Once everything above is configured, you will be able to integrate the HTML javascript blob to start collecting data."
                          />
                        </MDTypography>
                      </MDBox>

                      <Divider />
                      <MDBox mb={1}>
                        <MDTypography variant="h5">
                          <FormattedMessage
                            id="documentation.integrations.title"
                            defaultMessage="Waev Integrations"
                          />
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={1} mt={3}>
                        <MDTypography variant="body2" mb={3} ml={4}>
                          <FormattedMessage
                            id="documentation.integrations.text"
                            defaultMessage="Easily ingest data across platforms"
                          />
                        </MDTypography>
                      </MDBox>

                      <Divider />

                      <MDTypography variant="h5" mb={2}>
                        <FormattedMessage
                          id="documentation.imlementation.title"
                          defaultMessage="Implementation"
                        />
                      </MDTypography>
                      <Fold<Integration>
                        storageKey="foldedDocs"
                        title={intl.formatMessage(messages.webIntegration)}
                        item="standardWeb"
                        contents={
                          <MDBox ml={4} mt={1}>
                            <StandardWebDocs />
                          </MDBox>
                        }
                      />
                      {/* <Fold<Integration>
                        storageKey="foldedDocs"
                        title="Typeform Integration"
                        item="typeform"
                        contents={<TypeformDocs />}
                      /> */}

                      <Divider />

                      <MDTypography variant="h5">
                        <FormattedMessage
                          id="documentation.viewing.records.title"
                          defaultMessage="Viewing Records"
                        />
                      </MDTypography>
                      <Divider />
                      <MDTypography variant="body2" ml={4}>
                        <FormattedMessage
                          id="documentation.viewing.records.text"
                          defaultMessage="To see if the form is ingesting properly, you can visit your"
                        />{' '}
                        {
                          <Link to="/data/view-data">
                            <MDTypography
                              component="span"
                              variant="body2"
                              fontWeight="regular"
                              color="info"
                            >
                              <FormattedMessage
                                id="documentation.link.records.page"
                                defaultMessage="Waev Records Page"
                              />
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
