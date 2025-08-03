import { useContext, useEffect, useState } from 'react';

// react-router-dom components
import { Link, useSearchParams } from 'react-router-dom';

// @mui material components
import { Card } from '@mui/material';

// Waev Dashboard components
import { MDBox, MDTypography, MDInput, MDButton, MDSnackbar, FlashingLoader } from 'components';
import { AuthContext, CurrentUserContext } from 'contexts';
import { AuthPageType, InputEvent } from 'types';
import { validateEmail, defineMessages, useIntl, FormattedMessage } from 'utils';
import { useVerifyMagicLink } from 'hooks';

const messages = defineMessages({
  email: {
    id: 'magic_link.label.email',
    defaultMessage: 'Email',
  },
  errorTitle: {
    id: 'magic_link.error.title',
    defaultMessage: 'Whoops!',
  },
  error: {
    id: 'magic_link.error.message',
    defaultMessage: 'Something went wrong with the magic link request. Try again later.',
  },
  successTitle: {
    id: 'magic_link.success.title',
    defaultMessage: 'Success!',
  },
  successContent: {
    id: 'magic_link.success.content',
    defaultMessage: 'Check your email to complete the login.',
  },
});

interface MagicLinkProps {
  setPageType: (pageType: AuthPageType) => void;
}

export function MagicLink({ setPageType }: MagicLinkProps): JSX.Element {
  const intl = useIntl();
  const [searchParams] = useSearchParams();

  const { currentUser } = useContext(CurrentUserContext);

  let emailParam = searchParams.get('email');
  const keyParam = searchParams.get('key');

  if (emailParam && keyParam) {
    emailParam = emailParam.replace(' ', '+');
  }

  const { mutate: verifyMagicLink, error: errorVerifyMagicLink } = useVerifyMagicLink(
    emailParam,
    keyParam
  );

  useEffect(() => {
    if (emailParam && keyParam && !currentUser) {
      verifyMagicLink();
    }
  }, [emailParam, keyParam, currentUser]);

  const [successSB, setSuccessSB] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<any>();

  const closeSuccessSB = () => setSuccessSB(false);
  const closeErrorSB = () => setErrorStatus(undefined);

  const {
    email,
    setEmail,
    sendMagicLink,
    errorSendMagicLink,
    isMagicLinkRequestSuccess,
    isLoadingMagicLinkRequest,
  } = useContext(AuthContext);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const onClickSendMagicLink = () => {
    sendMagicLink();
  };

  const onClickSignIn = () => {
    setPageType('login');
  };
  const onClickRegister = () => {
    setPageType('register');
  };

  useEffect(() => {
    if (errorSendMagicLink) {
      if (errorSendMagicLink?.errors?.length) {
        setErrorStatus(errorSendMagicLink?.errors[0].source);
      } else {
        setErrorStatus(intl.formatMessage(messages.error));
      }
    }
  }, [errorSendMagicLink]);

  useEffect(() => {
    if (errorVerifyMagicLink) {
      if (errorVerifyMagicLink?.errors?.length) {
        setErrorStatus(errorVerifyMagicLink?.errors[0].source);
      } else {
        setErrorStatus(intl.formatMessage(messages.error));
      }
    }
  }, [errorVerifyMagicLink]);

  useEffect(() => {
    setSuccessSB(isMagicLinkRequestSuccess);
  }, [isMagicLinkRequestSuccess]);

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
          <FormattedMessage id="magic_link.title" defaultMessage="Sign in with magic link" />
        </MDTypography>
        <MDTypography display="block" variant="button" color="white" my={1}>
          <FormattedMessage
            id="magic_link.description"
            defaultMessage="Have a new magic link sent to your email."
          />
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox>
          <MDBox mb={2}>
            <MDInput
              inputProps={{
                'data-testid': 'magic-link-email',
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
              <FormattedMessage id="magic_link.invalid_email" defaultMessage="Email is invalid" />
            </MDTypography>
          )}

          <MDBox mt={4} mb={1}>
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              disabled={!isEmailValid || isLoadingMagicLinkRequest}
              onClick={onClickSendMagicLink}
            >
              {isLoadingMagicLinkRequest ? (
                <MDBox sx={{ width: '100%' }} data-testid="magiclink-loading-status">
                  <FlashingLoader />
                </MDBox>
              ) : (
                <FormattedMessage id="magic_link.sent_request" defaultMessage="Send Request" />
              )}
            </MDButton>
          </MDBox>
          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              <FormattedMessage
                id="magic_link.find"
                defaultMessage="Sign in with email and TOTP?"
              />{' '}
              <MDTypography
                component={Link}
                onClick={onClickSignIn}
                to="/sign-in"
                variant="button"
                color="info"
                fontWeight="bold"
                textGradient
              >
                <FormattedMessage id="magic_link.sign_in" defaultMessage="Sign In" />
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              <FormattedMessage
                id="magic_link.no_account"
                defaultMessage="Don't have an account?"
              />{' '}
              <MDTypography
                component={Link}
                onClick={onClickRegister}
                to="/register"
                variant="button"
                color="info"
                fontWeight="bold"
                textGradient
              >
                <FormattedMessage id="magic_link.sign_up" defaultMessage="Sign Up" />
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
