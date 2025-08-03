import { useContext } from 'hooks';
import { UnionContext } from 'contexts';
import { FancyCheckbox, MDBox, MDTypography } from 'components';
import { FormattedMessage } from 'utils';

export function PartsSelector(): JSX.Element {
  const {
    isAnonFieldAccessInput,
    setIsAnonFieldAccessInput,
    isMetaAccessInput,
    setIsMetaAccessInput,
    isPIIFieldAccessInput,
    setIsPIIFieldAccessInput,
  } = useContext(UnionContext);

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
            <FormattedMessage
              id="deployments.unions.parts_selector.private"
              defaultMessage="Private Fields"
            />
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
            <FormattedMessage
              id="deployments.unions.parts_selector.anon"
              defaultMessage="Anon Fields"
            />
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
            <FormattedMessage
              id="deployments.unions.parts_selector.meta"
              defaultMessage="Meta Data"
            />
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
