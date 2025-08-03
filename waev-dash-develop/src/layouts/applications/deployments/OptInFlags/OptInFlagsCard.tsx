import { InfoCard, MDBox, MDTypography } from 'components';
import { DeploymentContext, OptInFlagContext, SelectedEntityContext } from 'contexts';
import { useContext } from 'hooks';
import { OptInFlags } from '.';

// DataIngest page components

export function OptInFlagsCard(): JSX.Element {
  const { selectedDeployment } = useContext(SelectedEntityContext);
  const { updatingDeployment, updatingSection, setUpdatingSection, cleanup, isHasWriteAccess } =
    useContext(DeploymentContext);
  const {
    isLoadingOptInFlags,
    submitUpdatedFlags,
    flagsQueue,
    isFetchingOptInFlags,
    isLoadingUpdateFlags,
    cleanup: optInCleanup,
  } = useContext(OptInFlagContext);

  const body = (
    <MDBox alignItems="center" px={3}>
      {selectedDeployment?.attributes?.config ? (
        <OptInFlags
          isUpdating={updatingDeployment && updatingSection === 'optInFlags'}
          isLoading={isLoadingUpdateFlags}
        />
      ) : (
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="button" fontWeight="light" color="text">
            No Data Configurations
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );

  const onClickCancel = () => {
    setUpdatingSection(undefined);
    cleanup();
    optInCleanup();
  };

  return updatingDeployment && updatingSection ? (
    updatingSection === 'optInFlags' ? (
      <InfoCard
        title="Opt-In Fields"
        icon="thumb_up"
        value={body}
        menuIconRight="cancel"
        menuIconRightColor="secondary"
        menuIconLeft="check_circle"
        menuIconLeftColor="success"
        onClickRight={onClickCancel}
        onClickLeft={
          flagsQueue.length > 0 && !isFetchingOptInFlags && !isLoadingUpdateFlags
            ? submitUpdatedFlags
            : undefined
        }
      />
    ) : (
      <InfoCard title="Opt-In Fields" icon="thumb_up" value={body} />
    )
  ) : (
    <InfoCard
      title="Opt-In Fields"
      icon="thumb_up"
      value={body}
      menuIconRightFontWeight={400}
      menuIconRight="edit"
      iconRightId='editbuttonId'
      onClickRight={
        !isLoadingOptInFlags && isHasWriteAccess
          ? () => setUpdatingSection('optInFlags')
          : undefined
      }
      menuIconLeftFontWeight={400}
    />
  );
}
