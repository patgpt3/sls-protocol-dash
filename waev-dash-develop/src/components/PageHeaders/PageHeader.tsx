import { MDAvatar, MDBox, MDTypography } from 'components';
import { Card, Grid, Icon } from '@mui/material';

interface HeaderProps {
  avatar: JSX.Element | string;
  title: JSX.Element | string | any;
  subtitle?: string;
  actionsSection?: JSX.Element | any;
  sx?: any;
  id?:string;
}

export function Header({ avatar, title, subtitle, actionsSection, sx, id }: HeaderProps): JSX.Element {
  const avatarSection =
    typeof avatar === 'string' ? (
      <MDAvatar bgColor="info" alt={avatar} size="lg" shadow="sm" id={id}>
        <Icon fontSize="large">{avatar}</Icon>
      </MDAvatar>
    ) : (
      avatar
    );

  const titleSection =
    typeof title === 'string' ? (
      <MDBox height="100%" mt={0.5} lineHeight={1}>
        <MDTypography variant="h5" fontWeight="medium">
          {title}
        </MDTypography>
        {subtitle && (
          <MDTypography variant="button" color="text" fontWeight="medium">
            {subtitle}
          </MDTypography>
        )}
      </MDBox>
    ) : (
      title
    );

  return (
    <Card id="profile" sx={sx}>
      <MDBox p={2}>
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid item display="flex" alignItems="center" xs={12} sm={6} md={7} lg={8}>
            <MDBox mr={3}>{avatarSection}</MDBox>
            {titleSection}
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={4}>
            {actionsSection}
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}
