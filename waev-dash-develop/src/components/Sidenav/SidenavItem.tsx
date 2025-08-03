import { ReactNode } from 'react';

// @mui material components
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';
import { Theme } from '@mui/material/styles';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';

// Custom styles for the SidenavItem
import { item, itemContent, itemArrow } from 'components/Sidenav/styles/sidenavItem';

// Waev Dashboard contexts
import { useMaterialUIController } from 'contexts';
import { ListItemIcon } from '@mui/material';
import { collapseIconBox, collapseIcon } from './styles/sidenavCollapse';

// Declaring props types for SidenavCollapse
interface Props {
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark';
  name: string;
  active?: boolean | string;
  nested?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  open?: boolean;
  [key: string]: any;
}

function SidenavItem({ color, name, active, nested, children, open, icon, ...rest }: Props): JSX.Element {
  const [controller] = useMaterialUIController();
  const { isMiniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  return (
    <>
      <ListItem
        {...rest}
        component="li"
        sx={(theme) => item(theme, { active, color, transparentSidenav, whiteSidenav, darkMode })}
      >
        <MDBox
          sx={(theme: Theme): any =>
            itemContent(theme, {
              active,
              isMiniSidenav,
              name: 'h',
              open,
              nested,
              transparentSidenav,
              whiteSidenav,
              darkMode,
            })
          }
        >
          <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode })}
          >
            {typeof icon === 'string' ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>

          <ListItemText primary={name} />
          {children && (
            <Icon
              component="i"
              sx={(theme) =>
                itemArrow(theme, { open, isMiniSidenav, transparentSidenav, whiteSidenav, darkMode })
              }
            >
              expand_less
            </Icon>
          )}
        </MDBox>
      </ListItem>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit {...rest}>
          {children}
        </Collapse>
      )}
    </>
  );
}

// Declaring default props for SidenavItem
SidenavItem.defaultProps = {
  color: 'info',
  active: false,
  nested: false,
  children: false,
  open: false,
};

export default SidenavItem;
