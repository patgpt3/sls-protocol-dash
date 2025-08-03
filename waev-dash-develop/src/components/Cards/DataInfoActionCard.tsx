// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';
import MDAvatar from 'components/Elements/MDAvatar';
import { Icon } from '@mui/material';
import pxToRem from 'assets/theme/functions/pxToRem';
import colors from 'assets/theme-dark/base/colors';
import boxShadows from 'assets/theme/base/boxShadows';

// Declaring props types for QuickInfoActionCard
export interface DataInfoActionCardProps {
  image: string | JSX.Element;
  bg?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark';
  name?: string | JSX.Element;
  description?: string | string[] | JSX.Element;
  subDescription?: string | string[] | JSX.Element;
  descriptionIcon?: string | JSX.Element;

  route?: string;
  onClick?: React.MouseEventHandler;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark';
  label?: string | JSX.Element;
  link?: string;
  linkLabel?: string | JSX.Element;
  isHideButton?: boolean;
  isDisabled?: boolean;
  index?: string;
  sx?: any;
  descriptionWeight?: string;
}

export function DataInfoActionCard({
  image,
  bg,
  name,
  description,
  subDescription,
  descriptionIcon,
  isDisabled,
  route,
  onClick,
  color,
  isHideButton,
  label,
  link,
  linkLabel,
  index,
  sx,
  descriptionWeight,
}: DataInfoActionCardProps): JSX.Element {
  const { dark } = colors;
  const { sm } = boxShadows;

  const formattedName = () => {
    switch (typeof name) {
      case 'string': {
        return (
          <MDTypography variant="button" fontWeight="medium" data-testid="quick-info-name">
            {name}
          </MDTypography>
        );
      }
      default: {
        return name;
      }
    }
  };

  const formattedDescription = () => {
    switch (typeof description) {
      case 'string': {
        return (
          <MDTypography
            variant="caption"
            fontWeight={descriptionWeight || 'bold'}
            color="text"
            data-testid="quick-info-description"
          >
            {description}
          </MDTypography>
        );
      }
      case 'object': {
        return (
          <>
            {/* @ts-ignore */}
            {description?.map((dName, i) => (
              <MDBox display="flex" alignItems="center" key={`DescLink-${i}`}>
                <MDTypography
                  variant="button"
                  color="text"
                  lineHeight={1}
                  sx={{ mt: 0.15, mr: 0.5 }}
                >
                  <Icon>{descriptionIcon || 'link'}</Icon>
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  {dName}
                </MDTypography>
              </MDBox>
            ))}
          </>
        );
      }
      default: {
        return description;
      }
    }
  };
  const formattedSubDescription = () => {
    switch (typeof subDescription) {
      case 'string': {
        return (
          <MDTypography variant="caption" color="text" data-testid="quick-info-sub-description">
            {subDescription}
          </MDTypography>
        );
      }
      case 'object': {
        return (
          <>
            {/* @ts-ignore */}
            {subDescription?.map((dName, i) => (
              <MDBox display="flex" alignItems="center" key={`DescLink-${i}`}>
                <MDTypography
                  variant="button"
                  color="text"
                  lineHeight={1}
                  sx={{ mt: 0.15, mr: 0.5 }}
                >
                  <Icon>{descriptionIcon || 'link'}</Icon>
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  {dName}
                </MDTypography>
              </MDBox>
            ))}
          </>
        );
      }
      default: {
        return subDescription;
      }
    }
  };

  const isHover = isDisabled
    ? { opacity: 0.5 }
    : {
        '&:hover': {
          backgroundColor: dark.focus,
          borderRadius: pxToRem(12),
          cursor: 'pointer',
        },
      };

  return (
    <MDBox
      key={index}
      display="flex"
      alignItems="center"
      py={1}
      mb={2}
      sx={{
        ...isHover,
        borderRadius: pxToRem(12),
        border: '2px',
        borderStyle: 'solid',
        boxShadow: sm,
        ...sx,
      }}
      onClick={(e) => !isDisabled && onClick(e)}
    >
      <MDBox mr={2} sx={{ pl: 1 }}>
        {typeof image === 'string' ? (
          <MDAvatar src={image} alt="something here" shadow="md" data-testid="quick-info-image" />
        ) : (
          <MDAvatar
            bgColor={bg || 'info'}
            alt="something here"
            shadow="md"
            data-testid="quick-info-image"
          >
            {image}
          </MDAvatar>
        )}
      </MDBox>
      <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
        {formattedName()}
        {formattedDescription()}
        {formattedSubDescription()}
      </MDBox>
      {(onClick || route) && (
        <MDBox ml="auto" component="a" target="_blank" rel="noreferrer" color={color} pr={2}>
          {label}
        </MDBox>
      )}
      {link && linkLabel && <MDBox ml="auto"></MDBox>}
    </MDBox>
  );
}
