import { Grid } from '@mui/material';
import { MDBox } from 'components';
import { DeploymentUnion } from 'types';
import { DeploymentUnionItem } from './DeploymentUnionItem';
import { useContext } from 'hooks';
import { DeploymentContext, PermissionContext } from 'contexts';

interface DeploymentUnionListProps {
  unions: DeploymentUnion[];
}

export function DeploymentUnionList({ unions }: DeploymentUnionListProps): JSX.Element {
  const { isHasOwnerOrAdminAccess } = useContext(DeploymentContext);
  const { isLoadingPermissions } = useContext(PermissionContext);

  return (
    <MDBox id="selectUnionTable" pt={1} pb={2} px={2}>
      <Grid container>
        {unions &&
          !!unions.length &&
          unions.map((unionData, i) => {
            return (
              <DeploymentUnionItem
                key={`DataUnionItem-${i}`}
                union={unionData}
                isLoadingPermissions={isLoadingPermissions}
                isHasOwnerOrAdminAccess={isHasOwnerOrAdminAccess}
              />
            );
          })}
      </Grid>
    </MDBox>
  );
}
