import { useContext, useEffect, useState } from 'react';

// Waev Dashboard components
import { MDSnackbar } from 'components';
import { AuthContext, CurrentUserContext } from 'contexts';
import { useLogout } from 'hooks';
import { AuthPageType } from 'types';

// Authentication layout components
import { BasicLayout } from 'layouts/BasicLayout';
import { Register } from 'layouts/authentication/components/Register';
import { SignIn } from 'layouts/authentication/components/SignIn';
import { ForgotPassword } from 'layouts/authentication/components/ForgotPassword';
import { MagicLink } from 'layouts/authentication/components/MagicLink';
import { defineMessages, useIntl } from 'utils';

// Images
import bgImage from 'assets/images/waev/waev-bg.jpg';

const messages = defineMessages({
  waevTitle: {
    id: 'splash.waev.title',
    defaultMessage: 'Waev Dashboard',
  },
  loginSuccessContent: {
    id: 'splash.login.success.content',
    defaultMessage: "You've been logged in!",
  },
  errorContent: {
    id: 'splash.error.content',
    defaultMessage: 'There was a problem signing in.',
  },
  registerSuccessTitle: {
    id: 'splash.register.success.title',
    defaultMessage: 'You are registered!',
  },
  registerSuccessContent: {
    id: 'splash.register.success.content',
    defaultMessage: 'Check your email to get the Authenticator QR Code to retrieve the TOTP.',
  },
  registerErrorTitle: {
    id: 'splash.register.error.title',
    defaultMessage: 'Registration Error',
  },
  registerErrorContent: {
    id: 'splash.register.error.content',
    defaultMessage: 'There was a problem registering...',
  },
});

export function SignInBasic(): JSX.Element {
  const intl = useIntl();
  const { mutate: logout } = useLogout();
  const { errorLogin, isLoginSuccess, isRegisterSuccess } = useContext(AuthContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [isSuccessLoginSnackbar, setIsSuccessLoginSnackbar] = useState<boolean>(false);
  const [isFailureLoginSnackbar, setIsFailureLoginSnackbar] = useState<boolean>(false);
  const [isSuccessRegisterSnackbar, setIsSuccessRegisterSnackbar] = useState<boolean>(false);
  const [isFailureRegisterSnackbar, setIsFailureRegisterSnackbar] = useState<boolean>(false);
  const [pageType, setPageType] = useState<AuthPageType>('magicLink');

  useEffect(() => {
    (window.location.pathname === '/register' || window.location.pathname === '/register/') &&
      setPageType('register');
    (window.location.pathname === '/forgot-password' ||
      window.location.pathname === '/forgot-password/') &&
      setPageType('forgotPassword');
    window.location.pathname.startsWith('/magiclink') && setPageType('magicLink');
    currentUser && logout();
  }, []);

  useEffect(() => {
    if (isRegisterSuccess) {
      setPageType('magicLink');
      setIsSuccessRegisterSnackbar(true);
    }
  }, [isRegisterSuccess]);

  useEffect(() => {
    isLoginSuccess && currentUser && setIsSuccessLoginSnackbar(true);
  }, [currentUser, isLoginSuccess]);

  useEffect(() => {
    errorLogin && setIsFailureLoginSnackbar(true);
  }, [errorLogin]);

  const renderSuccessLoginSnackbar = (
    <MDSnackbar
      color="success"
      icon="check"
      title={intl.formatMessage(messages.waevTitle)}
      content={intl.formatMessage(messages.loginSuccessContent)}
      dateTime="Now"
      open={isSuccessLoginSnackbar}
      onClose={() => setIsSuccessLoginSnackbar(false)}
      close={() => setIsSuccessLoginSnackbar(false)}
      bgWhite
    />
  );

  const renderFailureLoginSnackbar = (
    <MDSnackbar
      color="error"
      icon="x"
      title={intl.formatMessage(messages.waevTitle)}
      content={intl.formatMessage(messages.errorContent)}
      dateTime="Now"
      open={isFailureLoginSnackbar}
      onClose={() => setIsFailureLoginSnackbar(false)}
      close={() => setIsFailureLoginSnackbar(false)}
      bgWhite
    />
  );

  const renderSuccessRegisterSnackbar = (
    <MDSnackbar
      color="success"
      icon="check"
      title={intl.formatMessage(messages.registerSuccessTitle)}
      content={intl.formatMessage(messages.registerSuccessContent)}
      dateTime="Now"
      open={isSuccessRegisterSnackbar}
      onClose={() => setIsSuccessRegisterSnackbar(false)}
      close={() => setIsSuccessRegisterSnackbar(false)}
      bgWhite
    />
  );

  const renderFailureRegisterSnackbar = (
    <MDSnackbar
      color="error"
      icon="x"
      title={intl.formatMessage(messages.registerErrorTitle)}
      content={intl.formatMessage(messages.registerErrorContent)}
      dateTime="Now"
      open={isFailureRegisterSnackbar}
      onClose={() => setIsFailureRegisterSnackbar(false)}
      close={() => setIsFailureRegisterSnackbar(false)}
      bgWhite
    />
  );

  const authCard = () => {
    switch (pageType) {
      case 'register':
        return <Register setPageType={setPageType} />;
      case 'login':
        return <SignIn setPageType={setPageType} />;
      case 'forgotPassword':
        return <ForgotPassword setPageType={setPageType} />;
      case 'magicLink':
        return <MagicLink setPageType={setPageType} />;
      default:
        return <MagicLink setPageType={setPageType} />;
    }
  };

  return (
    <BasicLayout image={bgImage}>
      {renderSuccessLoginSnackbar}
      {renderFailureLoginSnackbar}
      {renderFailureRegisterSnackbar}
      {renderSuccessRegisterSnackbar}
      {authCard()}
    </BasicLayout>
  );
}
