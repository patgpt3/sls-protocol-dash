import { MDBox, MDTypography } from 'components';
import { Grid } from '@mui/material';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actionsSection?: JSX.Element;
  sx?: any;
  [key: string]: any;
}

export function SubHeader({
  title,
  subtitle,
  actionsSection,
  sx,
  ...rest
}: HeaderProps): JSX.Element {
  return (
    <Grid container alignItems="center" sx={sx} {...rest}>
      <Grid item xs={7} pl={1}>
        <MDBox mb={1}>
          <MDTypography variant="h5">{title}</MDTypography>
        </MDBox>

        <MDBox mb={2}>
          <MDTypography variant="body2" color="text">
            {subtitle}
          </MDTypography>
        </MDBox>
      </Grid>
      {actionsSection ? (
        <Grid item xs={5} sx={{ textAlign: 'right', marginLeft: 'auto' }}>
          {actionsSection}
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
}
