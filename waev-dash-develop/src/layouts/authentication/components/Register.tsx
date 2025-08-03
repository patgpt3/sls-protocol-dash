import { useContext, useEffect, useState } from 'react';
import { Checkbox, Card, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { MDBox, MDTypography, MDInput, MDButton, MDSnackbar, FlashingLoader } from 'components';
import { AuthContext } from 'contexts';
import { AuthPageType, InputEvent } from 'types';
import { validateEmail, defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  errorTitle: {
    id: 'register.error.title',
    defaultMessage: 'Whoops!',
  },
  registerError: {
    id: 'register.error.message',
    defaultMessage: 'Something went wrong with registration. Try again later.',
  },
  successTitle: {
    id: 'register.success.title',
    defaultMessage: 'Success!',
  },
  successContent: {
    id: 'register.success.content',
    defaultMessage: 'An email has been sent.',
  },
  firstName: {
    id: 'register.label.first_name',
    defaultMessage: 'First Name',
  },
  lastName: {
    id: 'register.label.last_name',
    defaultMessage: 'Last Name',
  },
  email: {
    id: 'register.label.email',
    defaultMessage: 'Email',
  },
});

interface RegisterProps {
  setPageType?: (pageType: AuthPageType) => void;
}

export function Register({ setPageType }: RegisterProps): JSX.Element {
  const intl = useIntl();
  const {
    email,
    setEmail,
    setFirstName,
    firstName,
    lastName,
    setLastName,
    register,
    errorRegister,
    isRegisterSuccess,
    isLoadingRegister,
  } = useContext(AuthContext);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isRegisterEnabled, setIsRegisterEnabled] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const [successSB, setSuccessSB] = useState<boolean>(false);
  const [firstSubmit, setFirstSubmit] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string>();

  const closeSuccessSB = () => setSuccessSB(false);
  const closeErrorSB = () => setErrorStatus(undefined);

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  useEffect(() => {
    if (errorRegister) {
      if (errorRegister?.errors?.length) {
        setErrorStatus(errorRegister?.errors[0].source);
      } else {
        setErrorStatus(intl.formatMessage(messages.registerError));
      }
    }
  }, [errorRegister]);

  useEffect(() => {
    setSuccessSB(isRegisterSuccess);
  }, [isRegisterSuccess]);

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

  useEffect(() => {
    setIsRegisterEnabled(isTermsChecked);
  }, [isTermsChecked]);

  const onClickSignUp = () => {
    register();
  };

  const onTermsCheckClick = () => {
    setIsTermsChecked(!isTermsChecked);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setFirstSubmit(true);
    firstName && lastName && isEmailValid && onClickSignUp();
  };

  const onClickSignIn = () => {
    setPageType && setPageType('login');
  };

  return (
    <Card>
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
          <FormattedMessage id="register.join.us" defaultMessage="Join us today" />
        </MDTypography>
        <MDTypography display="block" variant="button" color="white" my={1}>
          <FormattedMessage
            id="register.enter.email"
            defaultMessage="Enter your email and password to register"
          />
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form">
          <MDBox mb={2}>
            <MDInput
              sx={{
                '& 	.MuiFormLabel-asterisk': {
                  color: '#db3131',
                },
              }}
              required
              inputProps={{
                'data-testid': 'register-first-name',
              }}
              type="text"
              label={intl.formatMessage(messages.firstName)}
              variant="standard"
              fullWidth
              onChange={(e: InputEvent) => setFirstName(e.target.value)}
            />
          </MDBox>
          {!firstName && firstSubmit && (
            <MDTypography display="block" variant="button" color="error" my={1}>
              <FormattedMessage
                id="register.first_name_required"
                defaultMessage="First name required"
              />
            </MDTypography>
          )}
          <MDBox mb={2}>
            <MDInput
              sx={{
                '& 	.MuiFormLabel-asterisk': {
                  color: '#db3131',
                },
              }}
              required
              inputProps={{
                'data-testid': 'register-last-name',
              }}
              type="text"
              label={intl.formatMessage(messages.lastName)}
              variant="standard"
              fullWidth
              onChange={(e: InputEvent) => setLastName(e.target.value)}
            />
          </MDBox>
          {!lastName && firstSubmit && (
            <MDTypography display="block" variant="button" color="error" my={1}>
              <FormattedMessage
                id="register.last_name_required"
                defaultMessage="Last name required"
              />
            </MDTypography>
          )}
          <MDBox mb={2}>
            <MDInput
              sx={{
                '& 	.MuiFormLabel-asterisk': {
                  color: '#db3131',
                },
              }}
              required
              inputProps={{
                'data-testid': 'register-email',
              }}
              type="email"
              label={intl.formatMessage(messages.email)}
              variant="standard"
              fullWidth
              onChange={(e: InputEvent) => setEmail(e.target.value)}
            />
          </MDBox>
          {!isEmailValid && firstSubmit && (
            <MDTypography display="block" variant="button" color="error" my={1}>
              <FormattedMessage id="register.invalid.email" defaultMessage="Email is invalid" />
            </MDTypography>
          )}
          <MDBox display="flex">
            <Checkbox
              checked={isTermsChecked}
              onChange={onTermsCheckClick}
              data-testid="register-checkbox"
              aria-checked={isTermsChecked}
              sx={{ pl: 0, pr: 2, pt: 1.25, alignSelf: 'flex-start' }}
            />
            <MDBox alignItems="center" ml={-1}>
              <MDTypography variant="caption" fontWeight="regular" color="text">
                <FormattedMessage
                  id="register.check.box.part1"
                  defaultMessage="By checking this box and clicking "
                />
              </MDTypography>
              <MDTypography variant="caption" fontWeight="bold" color="text">
                <FormattedMessage id="register.check.box.part2" defaultMessage="”SIGN UP”" />
              </MDTypography>
              <MDTypography variant="caption" fontWeight="regular" color="text">
                {', '}
                <FormattedMessage
                  id="register.check.box.part3"
                  defaultMessage="I acknowledge that I read and understand the "
                />
              </MDTypography>
              <Link target="_blank" href="https://www.waevdata.com/terms">
                <MDTypography variant="caption" fontWeight="bold" color="info" textGradient>
                  <FormattedMessage
                    id="register.check.box.part4"
                    defaultMessage="Waev Terms of Use"
                  />
                </MDTypography>
              </Link>
              <MDTypography variant="caption" fontWeight="regular" color="text">
                {', '}
                <FormattedMessage
                  id="register.check.box.part5"
                  defaultMessage="including the "
                />
              </MDTypography>
              <Link target="_blank" href="https://www.waevdata.com/privacy">
                <MDTypography variant="caption" fontWeight="bold" color="info" textGradient>
                  <FormattedMessage id="register.check.box.part6" defaultMessage="Privacy Policy" />
                </MDTypography>
              </Link>
              <MDTypography variant="caption" fontWeight="regular" color="text">
                {', '}
                <FormattedMessage
                  id="register.check.box.part7"
                  defaultMessage="and agree to be bound by both."
                />
              </MDTypography>
            </MDBox>
          </MDBox>
          <MDBox mt={3} mb={1}>
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              disabled={!isRegisterEnabled}
              onClick={onSubmit}
            >
              {isLoadingRegister ? (
                <MDBox sx={{ width: '100%' }} data-testid="register-loading-status">
                  <FlashingLoader />
                </MDBox>
              ) : (
                <FormattedMessage id="register.sign.up" defaultMessage="sign up" />
              )}
            </MDButton>
          </MDBox>
          {setPageType && (
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                <FormattedMessage
                  id="register.already.account"
                  defaultMessage="Already have an account?"
                />{' '}
                <MDTypography
                  component={RouterLink}
                  onClick={onClickSignIn}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="bold"
                  textGradient
                >
                  <FormattedMessage id="register.sign.in" defaultMessage="Sign In" />
                </MDTypography>
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </MDBox>
      {renderSuccessNotification}
      {renderErrorNotification}
    </Card>
  );
}
