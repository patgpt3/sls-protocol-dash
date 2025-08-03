import { DeploymentDropdown, FlashingLoader, MDBox, MDTypography, Header } from 'components';
import { SelectedEntityContext } from 'contexts';
import { useContext, useListDeployments } from 'hooks';
import { FormattedMessage } from 'utils';

interface HeaderProps {
  sx?: any;
}

export function CreateDataHeader({ sx }: HeaderProps): JSX.Element {
  const { selectedDeployment, selectedOrganizationId } = useContext(SelectedEntityContext);
  const { data: deployments, isLoading: isLoadingDeployments } =
    useListDeployments(selectedOrganizationId);

  const titleSection = (
    <MDBox height="100%" lineHeight={1}>
      <MDTypography variant="h5" fontWeight="medium">
        <FormattedMessage id="create_records.header.title" defaultMessage="Create Records" />
      </MDTypography>
      <MDTypography variant="button" color="text" fontWeight="medium">
        {selectedDeployment?.attributes.name || ''}
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
      {isLoadingDeployments ? (
        <MDBox width="100%">
          <FlashingLoader />
        </MDBox>
      ) : (
        selectedDeployment && deployments && deployments.length && <DeploymentDropdown />
      )}
    </MDBox>
  );

  return (
    <Header avatar="rocket-launch" title={titleSection} actionsSection={actionsSection} sx={sx} />
  );
}
