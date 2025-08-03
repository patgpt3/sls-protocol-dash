import { useContext, useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
// react-router-dom components
import { Link } from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';

// Waev Dashboard components
import { MDBox, MDTypography, MDInput, MDButton, FlashingLoader } from 'components';
import { AuthContext } from 'contexts';
import { AuthPageType, InputEvent } from 'types';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  email: {
    id: 'sign_in.label.email',
    defaultMessage: 'Email',
  },
  totp: {
    id: 'sign_in.label.TOTP',
    defaultMessage: '6-Digit TOTP Token',
  },
});

interface SignInProps {
  setPageType: (pageType: AuthPageType) => void;
}

export function SignIn({ setPageType }: SignInProps): JSX.Element {
  const intl = useIntl();
  const {
    email,
    setEmail,
    totp,
    setTotp,
    otp,
    // setOtp,
    login,
    isLoadingLogin,
    isRegisterSuccess,
  } = useContext(AuthContext);
  const [isLoginEnabled, setIsLoginEnabled] = useState(false);

  useEffect(() => {
    // setIsLoginEnabled(!!password && !!totp && !!email);
    setIsLoginEnabled((!!totp || !!otp) && !!email);
  }, [otp, totp, email]);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const onClickRegister = () => {
    setPageType('register');
  };
  const onForgotPassword = () => {
    setPageType('forgotPassword');
  };
  const onMagicLink = () => {
    setPageType('magicLink');
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    login();
  };
  const handlePaste = (e: any) => {
    let clipboardData, pastedData;

    e.stopPropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || (window as any).clipboardData;
    pastedData = clipboardData.getData('Text');

    setTotp(pastedData);
  };

  useEffect(() => {
    if (email && totp && totp.replace(/_/g, '').length === 6) {
      login();
    }
  }, [totp]);

  // useEffect(() => {
  //   if (otp && parseInt(otp).toString().length === 6) {
  //     login();
  //     r.current.value = '';
  //   }
  // }, [otp]);
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
          <FormattedMessage id="sign_in.waev.title" defaultMessage="Waev Dashboard" />
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form">
          <MDBox mb={2}>
            <MDInput
              inputProps={{
                'data-testid': 'sign-in-email-input',
              }}
              type="email"
              value={email}
              label={intl.formatMessage(messages.email)}
              fullWidth
              onChange={(e: InputEvent) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </MDBox>
          {/* <MDBox mb={2}>
            <MDInput
              type="password"
              label="Password"
              fullWidth
              onChange={(e: InputEvent) => setPassword(e.target.value)}
            />
          </MDBox> */}
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
              <MDInput
                // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                // TODO(): Remove this dev note.
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
            </InputMask>
          </MDBox>
          {/* <MDBox mb={2}>
            <InputMask
              mask="9 9 9  9 9 9"
              disabled={false}
              ref={r}
              type="string"
              onChange={(e: InputEvent) =>
                !(e.target.value.replace(/ /g, '') === '')
                  ? setOtp(e.target.value.replace(/ /g, ''))
                  : setOtp('')
              }
              onPaste={()=>{setOtp('')}}
            >
              {() => (
                <MDInput
                  // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  // TODO(): Remove this dev note.
                  label="6-Digit OTP Token"
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
          </MDBox> */}
          <MDBox mt={4} mb={1}>
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              onClick={onSubmit}
              disabled={!isLoginEnabled}
            >
              {isLoadingLogin ? (
                <MDBox sx={{ width: '100%' }} data-testid="sign-in-loading-status">
                  <FlashingLoader />
                </MDBox>
              ) : (
                <FormattedMessage id="sign_in.submit.button" defaultMessage="sign in" />
              )}
            </MDButton>
          </MDBox>
          <MDBox mt={3} textAlign="center">
            <MDTypography variant="button" color="text">
              <FormattedMessage id="sign_in.forget_password" defaultMessage="Forget Password?" />{' '}
              <MDTypography
                component={Link}
                onClick={onForgotPassword}
                to="/forgot-password"
                variant="button"
                color="info"
                fontWeight="bold"
                textGradient
              >
                <FormattedMessage id="sign_in.recover_account" defaultMessage="Recover Account" />
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox textAlign="center">
            <MDTypography variant="button" color="text">
              <FormattedMessage id="sign_in.magic_link_text" defaultMessage="Sign in with" />{' '}
              <MDTypography
                component={Link}
                onClick={onMagicLink}
                to="/magiclink"
                variant="button"
                color="info"
                fontWeight="bold"
                textGradient
              >
                <FormattedMessage id="sign_in.magic_link" defaultMessage="Magic Link" />
              </MDTypography>
            </MDTypography>
          </MDBox>
          {!isRegisterSuccess && (
            <MDBox mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                <FormattedMessage id="sign_in.no_account" defaultMessage="Don't have an account?" />{' '}
                <MDTypography
                  component={Link}
                  onClick={onClickRegister}
                  to="/register"
                  variant="button"
                  color="info"
                  fontWeight="bold"
                  textGradient
                >
                  <FormattedMessage id="sign_in.sign_up" defaultMessage="Sign Up" />
                </MDTypography>
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}
