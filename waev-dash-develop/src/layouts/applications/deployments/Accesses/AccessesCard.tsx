import { InfoCard, MDBox, MDTypography } from 'components';
import { DeploymentContext, AccessContext, SelectedEntityContext } from 'contexts';
import { useContext } from 'hooks';
import { Accesses } from '.';
import { defineMessages, useIntl } from 'utils';

const messages = defineMessages({
  noConfigs: {
    id: 'deployments.accesses.card.no_configs',
    defaultMessage: 'No Data Configurations',
  },
  apiKeys: {
    id: 'deployments.accesses.card.api_keys',
    defaultMessage: 'API Keys',
  },
});

// DataIngest page components

export function AccessesCard(): JSX.Element {
  const intl = useIntl();
  const { selectedDeployment } = useContext(SelectedEntityContext);
  const { updatingDeployment, updatingSection, setUpdatingSection, cleanup, isHasWriteAccess } =
    useContext(DeploymentContext);
  const { accesses, createAccess, isLoadingAccesses } = useContext(AccessContext);

  const body = (
    <MDBox alignItems="center" px={3}>
      {selectedDeployment?.attributes?.config ? (
        <Accesses isUpdating={updatingDeployment && updatingSection === 'accesses'} />
      ) : (
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="button" fontWeight="light" color="text">
            {intl.formatMessage(messages.noConfigs)}
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );

  const onClickCancel = () => {
    setUpdatingSection(undefined);
    cleanup();
  };

  return updatingDeployment && updatingSection ? (
    updatingSection === 'accesses' ? (
      <InfoCard
        title={intl.formatMessage(messages.apiKeys)}
        icon="key"
        value={body}
        menuIconRight={!isLoadingAccesses && 'cancel'}
        menuIconRightColor="secondary"
        onClickRight={!isLoadingAccesses && onClickCancel}
      />
    ) : (
      <InfoCard title={intl.formatMessage(messages.apiKeys)} icon="key" value={body} />
    )
  ) : (
    <InfoCard
      title={intl.formatMessage(messages.apiKeys)}
      icon="key"
      value={body}
      menuIconRightFontWeight={400}
      menuIconRight={accesses?.length ? 'edit' : 'add'}
      onClickRight={
        !isLoadingAccesses && isHasWriteAccess
          ? () => setUpdatingSection('accesses')
          : () => createAccess()
      }
      menuIconLeftFontWeight={400}
    />
  );
}
