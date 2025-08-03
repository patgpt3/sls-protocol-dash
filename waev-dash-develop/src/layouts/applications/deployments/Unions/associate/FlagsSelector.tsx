import { useContext } from 'hooks';
import { UnionContext, OptInFlagContext } from 'contexts';
import { FancyCheckbox, MDBox, MDTypography } from 'components';
import { OptInFlag } from 'types';

export function FlagsSelector(): JSX.Element {
  const { consentFlagsInput, addConsentFlagInput, removeConsentFlagInput } =
    useContext(UnionContext);
  const { optInFlags } = useContext(OptInFlagContext);

  const consentFlagSelectorInput = (consentFlagsInput || []).map(
    (flag) => flag?.attributes?.field_selector
  );

  return (
    <MDBox>
      {optInFlags.length !== 0 ? (
        <>
          {optInFlags?.map((flag: OptInFlag) => {
            return (
              <MDBox key={flag.attributes.name} display="flex" alignItems="center">
                <MDBox>
                  <FancyCheckbox
                    isSelected={consentFlagSelectorInput.includes(flag.attributes.field_selector)}
                    icon="thumb_up"
                    onSelect={() =>
                      consentFlagSelectorInput.includes(flag.attributes.field_selector)
                        ? removeConsentFlagInput(flag)
                        : addConsentFlagInput(flag)
                    }
                  />
                  <MDTypography variant="caption" color="text" mr={2}>
                    {flag.attributes.name}
                  </MDTypography>
                </MDBox>
              </MDBox>
            );
          })}
        </>
      ) : (
        <></>
      )}
    </MDBox>
  );
}
