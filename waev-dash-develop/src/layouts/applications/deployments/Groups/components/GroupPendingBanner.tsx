import { Banner, MDBox } from 'components';
import MDAlertCloseIcon from 'components/Elements/MDAlert/MDAlertCloseIcon';
import { useState } from 'react';
// import { defineMessages, useIntl } from 'react-intl';
import { Group } from 'types';

export interface GroupPendingBannerProps {
  group: Group;
}

export function GroupPendingBanner({ group }: GroupPendingBannerProps): JSX.Element {
  // const intl = useIntl();

  // const messages = defineMessages({
  //   cancel: {
  //     id: 'PendingBanner.header.button.cancel',
  //     defaultMessage: 'Cancel',
  //   },
  //   deleteTitle: {
  //     id: 'PendingBanner.header.delete.title',
  //     defaultMessage: `Delete Group'}?`,
  //   },
  //   deleteDescription1: {
  //     id: 'PendingBanner.header.delete.description1',
  //     defaultMessage: `Are you sure you want to delete ${group?.attributes.name}`,
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

  const bannerTitle = group.attributes.status === 'pending' ? 'Pending!' : 'Processing!';

  return (
    isBannerOpen && (
      <>
        <Banner
          bg="warning"
          title={bannerTitle}
          subtitle={`The group "${group?.attributes.name}" is currently being created. Hang tight.`}
          isLoading
          actionsSection={actions}
        />
      </>
    )
  );
}
