import { InfoCard, MDBox } from 'components';
import { DeploymentContext, SelectedEntityContext } from 'contexts';
import { useContext, useListGroups } from 'hooks';
import { Groups } from './Groups';

// DataIngest page components

export function GroupsCard(): JSX.Element {
  const { selectedDeploymentId } = useContext(SelectedEntityContext);
  const { updatingDeployment, updatingSection } = useContext(DeploymentContext);
  const { setIsAddingGroup, isHasOwnerOrAdminAccess } = useContext(DeploymentContext);
  const { data: groups, isLoading: isLoadingGroups } = useListGroups(selectedDeploymentId);

  const body = (
    <MDBox alignItems="center" px={3}>
      <Groups
        isUpdating={updatingDeployment && updatingSection === 'groups'}
        groups={groups || []}
        isLoadingGroups={isLoadingGroups}
      />
    </MDBox>
  );

  const onClickAdd = () => {
    setIsAddingGroup(true);
  };

  // return updatingDeployment && updatingSection ? (
  //   updatingSection === 'groups' ? (
  //     <InfoCard
  //       title="Shared Access Groups"
  //       icon="groups"
  //       value={body}
  //       menuIconRight="cancel"
  //       menuIconRightColor="secondary"
  //       onClickRight={onClickCancel}
  //     />
  //   ) : (
  //     <InfoCard title="Shared Access Groups" icon="groups" value={body} />
  //   )
  // ) : (
  return isHasOwnerOrAdminAccess ? (
    <InfoCard
      title="Shared Access Groups"
      icon="groups"
      value={body}
      menuIconRightFontWeight={800}
      menuIconRight="add"
      onClickRight={onClickAdd}
      id="groupsCard"
    />
  ) : (
    <InfoCard
      title="Shared Access Groups"
      icon="groups"
      value={body}
      menuIconRightFontWeight={800}
    />
  );
}
