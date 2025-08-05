import { useContext, useEffect } from 'react';
import InputMask from 'react-input-mask';
// react-router-dom components
// import { Link } from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';

// Waev Dashboard components
import { MDBox, MDTypography, MDInput, MDButton, FlashingLoader } from 'components';
import { AuthContext, CurrentUserContext } from 'contexts';
import { InputEvent } from 'types';
import { useLogout } from 'hooks';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  totp: {
    id: 'renew_token.label.TOTP',
    defaultMessage: '6-Digit TOTP Token',
  },
});

interface RenewTokenProps {
  onSuccess: () => void;
}

export function RenewToken({ onSuccess }: RenewTokenProps): JSX.Element {
  const intl = useIntl();
  const { currentUser } = useContext(CurrentUserContext);
  const {
    setEmail,
    totp,
    setTotp,
    renewToken,
    isLoadingRenewToken,
    isErrorRenewToken,
    isSuccessRenewToken,
  } = useContext(AuthContext);
  const { mutate: logout } = useLogout();

  const onSubmit = (e: any) => {
    e.preventDefault();
    renewToken();
  };

  const handlePaste = (e: any) => {
    var clipboardData, pastedData;

    e.stopPropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || (window as any).clipboardData;
    pastedData = clipboardData.getData('Text');

    setTotp(pastedData);
  };

  useEffect(() => {
    if (totp && totp.replace(/_/g, '').length === 6) {
      renewToken();
    }
  }, [totp]);

  useEffect(() => {
    currentUser && setEmail(currentUser?.attributes?.email);
  }, []);

  useEffect(() => {
    isSuccessRenewToken && onSuccess();
  }, [isSuccessRenewToken]);

  return (
    <Card>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
        mx={8}
        mt={-3}
        p={2}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          <FormattedMessage id="renew_token.title" defaultMessage="Session Expiring Soon" />
        </MDTypography>
      </MDBox>
      <MDTypography variant="h6" fontWeight="medium" color="text" textAlign="center" mt={1}>
        {currentUser.attributes.email}
      </MDTypography>
      <MDBox pt={2} pb={3} px={3}>
        <MDBox component="form" role="form">
          <MDBox mb={2}>
            {/* @ts-ignore */}
            <InputMask
              id="totp-input"
              mask="9 9 9  9 9 9"
              disabled={false}
              value={totp}
              type="string"
              alwaysShowMask={true}
              onChange={(e: InputEvent) =>
                !(e.target.value.replace(/ /g, '') === '')
                  ? setTotp(e.target.value.replace(/ /g, ''))
                  : setTotp('')
              }
              onPaste={handlePaste}
            >
              {(inputProps: any) => (
                <MDInput
                  {...inputProps}
                  inputProps={{
                    'data-testid': 'totp-input',
                  }}
                  label={intl.formatMessage(messages.totp)}
                  fullWidth
                  sx={{
                    'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      m: 0,
                    },
                    'input[type=number] ': {
                      MozAppearance: 'textfield',
                    },
                    input: { textAlign: 'center' },
                  }}
                />
              )}
            </InputMask>
          </MDBox>
          {!!isErrorRenewToken && (
            <MDTypography display="block" variant="button" color="error" my={1}>
              {'* '}
              <FormattedMessage
                id="renew_token.invalid"
                defaultMessage="Token is invalid for"
              />{' '}
              {currentUser?.attributes?.email}.
            </MDTypography>
          )}
          <MDBox mt={4} mb={1}>
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              onClick={onSubmit}
              disabled={!totp || !(totp.length > 5)}
            >
              {isLoadingRenewToken ? (
                <MDBox sx={{ width: '100%' }} data-testid="sign-in-loading-status">
                  <FlashingLoader />
                </MDBox>
              ) : (
                <FormattedMessage id="renew_token.button" defaultMessage="renew" />
              )}
            </MDButton>
          </MDBox>
          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography
              onClick={logout}
              variant="button"
              color="info"
              fontWeight="bold"
              textGradient
            >
              <FormattedMessage id="renew_token.logout" defaultMessage="Log Out?" />
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}
