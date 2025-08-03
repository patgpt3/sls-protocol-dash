import { useContext } from 'hooks';
import { GroupContext } from 'contexts';

import { FancyCheckbox, MDBox, MDTypography } from 'components';

export function GroupAccessesSelector(): JSX.Element {
  const {
    isAnonFieldAccessInput,
    setIsAnonFieldAccessInput,
    isMetaAccessInput,
    setIsMetaAccessInput,
    isPIIFieldAccessInput,
    setIsPIIFieldAccessInput,
  } = useContext(GroupContext);

  return (
    <MDBox>
      <MDBox display="flex" alignItems="center">
        <MDBox>
          <FancyCheckbox
            isSelected={isPIIFieldAccessInput}
            icon="lock"
            onSelect={() => setIsPIIFieldAccessInput(!isPIIFieldAccessInput)}
          />
          <MDTypography variant="caption" color="text" mr={2}>
            Private Fields
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <MDBox>
          <FancyCheckbox
            isSelected={isAnonFieldAccessInput}
            icon="lock_open"
            onSelect={() => setIsAnonFieldAccessInput(!isAnonFieldAccessInput)}
          />
          <MDTypography variant="caption" color="text" mr={2}>
            Anon Fields
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <MDBox>
          <FancyCheckbox
            isSelected={isMetaAccessInput}
            icon="code"
            onSelect={() => setIsMetaAccessInput(!isMetaAccessInput)}
          />
          <MDTypography variant="caption" color="text" mr={2}>
            Meta Data
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
