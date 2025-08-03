import { useContext, useEffect, useState } from 'react';

// react-router-dom components
import { Link } from 'react-router-dom';

// @mui material components
import { Card } from '@mui/material';

// Waev Dashboard components
import { MDBox, MDTypography, MDInput, MDButton, MDSnackbar, FlashingLoader } from 'components';
import { AuthContext } from 'contexts';
import { AuthPageType, InputEvent } from 'types';
import { validateEmail, defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  email: {
    id: 'forgot_password.label.email',
    defaultMessage: 'Email',
  },
  errorTitle: {
    id: 'forgot_password.error.title',
    defaultMessage: 'Whoops!',
  },
  error: {
    id: 'forgot_password.error.message',
    defaultMessage: 'Something went wrong with the password request. Try again later.',
  },
  successTitle: {
    id: 'forgot_password.success.title',
    defaultMessage: 'Success!',
  },
  successContent: {
    id: 'forgot_password.success.content',
    defaultMessage: 'If the email was in the system, a request has been sent.',
  },
});

interface ForgotPasswordProps {
  setPageType: (pageType: AuthPageType) => void;
}

export function ForgotPassword({ setPageType }: ForgotPasswordProps): JSX.Element {
  const intl = useIntl();
  const [successSB, setSuccessSB] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string>();

  const closeSuccessSB = () => setSuccessSB(false);
  const closeErrorSB = () => setErrorStatus(undefined);

  const {
    email,
    setEmail,
    sendForgotPassword,
    errorForgotPassword,
    isForgotPasswordRequestSuccess,
    isLoadingForgotPasswordRequest,
  } = useContext(AuthContext);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const onClickSignUp = () => {
    sendForgotPassword();
  };

  const onClickSignIn = () => {
    setPageType('login');
  };

  useEffect(() => {
    if (errorForgotPassword) {
      if (errorForgotPassword?.errors?.length) {
        setErrorStatus(errorForgotPassword?.errors[0].source);
      } else {
        setErrorStatus(intl.formatMessage(messages.error));
      }
    }
  }, [errorForgotPassword]);

  useEffect(() => {
    setSuccessSB(isForgotPasswordRequestSuccess);
  }, [isForgotPasswordRequestSuccess]);

  const renderSuccessNotification = (
    <MDSnackbar
      color="success"
      icon="check"
      title={intl.formatMessage(messages.successTitle)}
      content={intl.formatMessage(messages.successContent)}
      dateTime="Now"
      open={successSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorNotification = (
    <MDSnackbar
      color="error"
      icon="x"
      title={intl.formatMessage(messages.errorTitle)}
      content={errorStatus}
      dateTime="Now"
      open={!!errorStatus}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <Card sx={{ position: 'relative' }}>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={8}
        mt={-3}
        p={3}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          <FormattedMessage id="forgot_password.title" defaultMessage="Forgot Password?" />
        </MDTypography>
        <MDTypography display="block" variant="button" color="white" my={1}>
          <FormattedMessage
            id="forgot_password.description"
            defaultMessage="Have a new QR Code sent to your email."
          />
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox>
          <MDBox mb={2}>
            <MDInput
              inputProps={{
                'data-testid': 'forgot-pass-email',
              }}
              type="email"
              label={intl.formatMessage(messages.email)}
              variant="standard"
              fullWidth
              onChange={(e: InputEvent) => setEmail(e.target.value)}
            />
          </MDBox>
          {!!email && !isEmailValid && (
            <MDTypography display="block" variant="button" color="error" my={1}>
              <FormattedMessage
                id="forgot_password.invalid_email"
                defaultMessage="Email is invalid"
              />
            </MDTypography>
          )}

          <MDBox mt={4} mb={1}>
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              disabled={!isEmailValid || isLoadingForgotPasswordRequest}
              onClick={onClickSignUp}
            >
              {isLoadingForgotPasswordRequest ? (
                <MDBox sx={{ width: '100%' }} data-testid="forgot-password-loading-status">
                  <FlashingLoader />
                </MDBox>
              ) : (
                <FormattedMessage id="forgot_password.sent_request" defaultMessage="Send Request" />
              )}
            </MDButton>
          </MDBox>
          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              <FormattedMessage id="forgot_password.find" defaultMessage="Did you find it?" />{' '}
              <MDTypography
                component={Link}
                onClick={onClickSignIn}
                to="/sign-in"
                variant="button"
                color="info"
                fontWeight="bold"
                textGradient
              >
                <FormattedMessage id="forgot_password.sign_in" defaultMessage="Sign In" />
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      {renderSuccessNotification}
      {renderErrorNotification}
    </Card>
  );
}
