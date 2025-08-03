import { createContext, PropsWithChildren } from 'react';
import { WaevAvatar } from 'components';

import { useState } from 'hooks';
import { noop } from 'utils';

import { WaevErrors } from 'types';
// import { SelectedEntityContext } from './selectedEntityContext';
import { MDSnackbar } from 'components';

interface NotificationWithSetter {
  // Notifications
  notificationRenderSuccessNotification: JSX.Element | undefined;
  notificationRenderErrorNotification: JSX.Element | undefined;
  renderLoader: JSX.Element | undefined;
  setSuccessNotification: (setSuccessNotification: { title?: string; message?: string }) => void;
  setErrorNotification: (setErrorNotification: { title?: string; message?: string }) => void;
  setErrorsNotification: (errorResponse: WaevErrors) => void;
}

export const NotificationContext = createContext<NotificationWithSetter>({
  // Notifications
  notificationRenderSuccessNotification: undefined,
  notificationRenderErrorNotification: undefined,
  renderLoader: undefined,
  setSuccessNotification: noop,
  setErrorNotification: noop,
  setErrorsNotification: noop,
});

interface Props {
  value?: NotificationWithSetter;
}

export const NotificationContextProvider = ({
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  // Notifications
  const [successNotification, setSuccessNotification] = useState<
    { title?: string; message?: string } | undefined
  >(undefined);
  const [errorNotification, setErrorNotification] = useState<
    { title?: string; message?: string } | undefined
  >(undefined);

  const cleanupSuccess = () => {
    setSuccessNotification(undefined);
  };

  const cleanupError = () => {
    setErrorNotification(undefined);
  };

  const setErrorsNotification = (errorResponse: WaevErrors) => {
    const title = errorResponse?.errors?.length
      ? Array.from(new Set(errorResponse?.errors.map((err: any) => err.title))).join('; ')
      : 'Error!';
    const message = errorResponse?.errors?.length
      ? Array.from(new Set(errorResponse?.errors.map((err: any) => err.detail))).join('; ')
      : 'Something went wrong...';
    setErrorNotification({ title, message });
  };

  const notificationRenderSuccessNotification = (
    <MDSnackbar
      color="success"
      icon="check"
      title={successNotification?.title || 'Success!'}
      content={successNotification?.message || ''}
      dateTime="Now"
      open={!!successNotification}
      onClose={() => cleanupSuccess()}
      close={() => cleanupSuccess()}
      bgWhite
    />
  );

  const notificationRenderErrorNotification = (
    <MDSnackbar
      color="error"
      icon="x"
      title={errorNotification?.title || 'Error'}
      content={errorNotification?.message || 'Please try again.'}
      dateTime="Now"
      open={!!errorNotification}
      onClose={() => cleanupError()}
      close={() => cleanupError()}
      bgWhite
    />
  );

  const renderLoader = (
    <WaevAvatar
      alt="profile-image"
      size="lg"
      shadow="sm"
      bgColor="info"
      isAnimating={true}
      opacity="0.4"
    />
  );

  return (
    <NotificationContext.Provider
      value={{
        // Notifications
        notificationRenderSuccessNotification,
        notificationRenderErrorNotification,
        renderLoader,
        setSuccessNotification,
        setErrorNotification,
        setErrorsNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
