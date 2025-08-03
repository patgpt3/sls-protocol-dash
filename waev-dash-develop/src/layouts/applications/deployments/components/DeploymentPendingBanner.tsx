import { Banner, MDBox } from 'components';
import MDAlertCloseIcon from 'components/Elements/MDAlert/MDAlertCloseIcon';
import { useState } from 'react';
// import { defineMessages, useIntl } from 'react-intl';
import { Deployment } from 'types';

export interface DeploymentPendingBannerProps {
  deployment: Deployment;
}

export function DeploymentPendingBanner({ deployment }: DeploymentPendingBannerProps): JSX.Element {
  // const intl = useIntl();

  // const messages = defineMessages({
  //   cancel: {
  //     id: 'PendingBanner.header.button.cancel',
  //     defaultMessage: 'Cancel',
  //   },
  //   deleteTitle: {
  //     id: 'PendingBanner.header.delete.title',
  //     defaultMessage: `Delete Deployment'}?`,
  //   },
  //   deleteDescription1: {
  //     id: 'PendingBanner.header.delete.description1',
  //     defaultMessage: `Are you sure you want to delete ${deployment?.attributes.name}`,
  //   },
  //   yes: {
  //     id: 'PendingBanner.header.delete.yes',
  //     defaultMessage: 'Yes',
  //   },
  // });

  const [isBannerOpen, setIsBannerOpen] = useState<boolean>(true);

  const actions = (
    <MDBox sx={{ textAlign: 'end' }}>
      <MDAlertCloseIcon
        onClick={() => {
          setIsBannerOpen(false);
        }}
        sx={{ fontSize: '50px', verticalAlign: 'middle', ml: '1rem', mr: 2 }}
      >
        &times;
      </MDAlertCloseIcon>
    </MDBox>
  );

  const bannerTitle = deployment.attributes.status === 'pending' ? 'Pending!' : 'Processing!';

  return (
    isBannerOpen && (
      <>
        <Banner
          bg="warning"
          title={bannerTitle}
          subtitle={`The deployment "${deployment?.attributes.name}" is currently being created. Hang tight.`}
          isLoading
          actionsSection={actions}
        />
      </>
    )
  );
}
