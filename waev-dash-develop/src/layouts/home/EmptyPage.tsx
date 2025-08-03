// Waev Dashboard components
import { MDBox, MDTypography } from 'components';
import colors from 'assets/theme/base/colors';
import { Link } from 'react-router-dom';

// Waev Dashboard examples components
import { useContext } from 'react';
import { ApiLoaderContext, OrganizationContext, SelectedEntityContext } from 'contexts';

const { info } = colors;

interface Props {
  noOrganizationMessage?: string;
  noOrganizationMessage2?: string;
  noDeploymentMessage?: string;
  noDeploymentMessage2?: string;
  organizationLinkText?: string;
  organizationLinkPath?: string;
  deploymentsLinkText?: string;
  deploymentsLinkPath?: string;
  deploymentsLinkOnCLick?: () => void;
  page?: 'Settings' | 'Deployments' | 'ViewData' | 'CreateData';
}
export function EmptyPage({
  noOrganizationMessage,
  noOrganizationMessage2,
  noDeploymentMessage,
  noDeploymentMessage2,
  organizationLinkText,
  organizationLinkPath,
  deploymentsLinkText,
  deploymentsLinkPath,
  deploymentsLinkOnCLick,
  page,
}: Props): JSX.Element {
  const { selectedOrganization, selectedDeployment } = useContext(SelectedEntityContext);
  const { isLoadingOrganization } = useContext(OrganizationContext);
  const { isLoadingGlobal, isFirstLoad } = useContext(ApiLoaderContext);

  return (
    <>
      {(!selectedDeployment || !selectedOrganization) &&
        !isLoadingOrganization &&
        isFirstLoad &&
        !isLoadingGlobal && (
          <MDBox
            sx={{
              textAlign: 'center',
              flex: 99,
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <MDBox
              py={page === 'Settings' ? 0 : 3}
              sx={{
                textAlign: 'center',
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <MDBox flex={1}>
                <MDBox position="relative" display="flex" flexDirection={'row'}>
                  <MDTypography variant="button" fontWeight="regular" textAlign="center">
                    {!selectedOrganization ? (
                      <>
                        {noOrganizationMessage}
                        {organizationLinkText && (
                          <Link
                            to={organizationLinkPath}
                            style={{
                              color: info.main,
                              pointerEvents: !!(page === 'Settings') ? 'none' : 'inherit',
                            }}
                          >
                            {organizationLinkText}
                          </Link>
                        )}
                        {noOrganizationMessage2}
                      </>
                    ) : (
                      page !== 'Settings' && (
                        <>
                          {noDeploymentMessage}
                          {deploymentsLinkText && (
                            <Link
                              to={deploymentsLinkPath}
                              style={{
                                color: info.main,
                                pointerEvents: 'inherit',
                              }}
                              onClick={deploymentsLinkOnCLick}
                            >
                              {deploymentsLinkText}
                            </Link>
                          )}
                          {noDeploymentMessage2}
                        </>
                      )
                    )}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>
        )}
    </>
  );
}
