import { useContext } from 'react';
import { OrganizationDropdown, FlashingLoader, MDBox, MDTypography, Header } from 'components';
import { FormattedMessage } from 'utils';
import { SelectedEntityContext, CurrentUserContext } from 'contexts';
import { useListOrganizations } from 'hooks';

interface HeaderProps {
  sx?: any;
}

export function UnionsHeader({ sx }: HeaderProps): JSX.Element {
  const { currentUser, token } = useContext(CurrentUserContext);
  const { isLoadingOrganization } = useContext(SelectedEntityContext);
  const { data: organizations, isLoading: isLoadingOrganizations } = useListOrganizations(
    currentUser,
    token
  );

  const titleSection = (
    <MDBox height="100%" lineHeight={1}>
      <MDTypography variant="h5" fontWeight="medium">
        <FormattedMessage id="unions.header.title" defaultMessage="Data Unions" />
      </MDTypography>
    </MDBox>
  );

  const actionsSection = (
    <MDBox
      display="flex"
      justifyContent={{ xs: 'space-between', sm: 'flex-end', md: 'flex-end' }}
      alignItems="center"
      lineHeight={1}
      width="100%"
    >
      {isLoadingOrganization || isLoadingOrganizations ? (
        <MDBox width="100%">
          <FlashingLoader />
        </MDBox>
      ) : (
        organizations && organizations.length && <OrganizationDropdown />
      )}
    </MDBox>
  );

  return (
    <Header avatar="group_work" title={titleSection} actionsSection={actionsSection} sx={sx} />
  );
}
