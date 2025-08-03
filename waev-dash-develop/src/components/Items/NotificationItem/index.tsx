import { forwardRef, FC, ReactNode } from 'react';

// @mui material components
import MenuItem from '@mui/material/MenuItem';
import { MenuItemProps } from '@mui/material';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';

// custom styles for the NotificationItem
import menuItem from 'components/Items/NotificationItem/styles';

// Declaring props types for NotificationItem
interface Props extends MenuItemProps {
  icon: ReactNode;
  title: string;
  [key: string]: any;
}

export const NotificationItem = forwardRef<HTMLLIElement, Props>(({ icon, title, ...rest }, ref) => (
  <MenuItem {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
    <MDBox
      // component={Link}
      py={0.5}
      display="flex"
      alignItems="center"
      lineHeight={1}
      // href="/pages/account/settings"
    >
      {typeof icon === 'string' ? (
        <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
          {icon}
        </MDTypography>
      ) : (
        icon
      )}
      <MDTypography variant="button" fontWeight="regular" sx={{ ml: 1 }}>
        {title}
      </MDTypography>
    </MDBox>
  </MenuItem>
));
