import { ConfirmationModal, FlashingLoader, MDBox, MDTypography } from 'components';
import { GroupContext } from 'contexts';
import { useContext } from 'react';
import { Group } from 'types';
import { GroupItem } from './GroupItem';

interface GroupsProps {
  isUpdating?: boolean;
  groups?: Group[];
  isLoadingGroups?: boolean;
}

export function Groups({ groups, isLoadingGroups }: GroupsProps): JSX.Element {
  const { updatingGroup, setUpdatingGroup, deleteGroup, isDeletingGroup, setIsDeletingGroup } =
    useContext(GroupContext);

  return isLoadingGroups ? (
    <MDBox width="100%">
      <FlashingLoader />
    </MDBox>
  ) : (
    <>
      <ConfirmationModal
        isOpen={!!isDeletingGroup}
        setIsOpen={() => {
          setUpdatingGroup(undefined);
          setIsDeletingGroup(false);
        }}
        title="Delete Organization?"
        description={`Are you sure you want to delete ${
          updatingGroup?.attributes.name || 'this organization'
        }?`}
        primaryText="Yes"
        onPrimaryClick={() => {
          deleteGroup();
          setIsDeletingGroup(false);
        }}
        secondaryText="Cancel"
        onSecondaryClick={() => {
          setUpdatingGroup(undefined);
          setIsDeletingGroup(false);
        }}
      />
      {groups?.length ? (
        groups.map((group, i) => {
          return <GroupItem group={group} key={`GroupItem-${i}`} index={i} />;
        })
      ) : (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          <MDTypography variant="button" fontWeight="light" color="text" justifyContent="center">
            No Groups Created
          </MDTypography>
        </MDBox>
      )}
    </>
  );
}
