import { createContext, useContext, PropsWithChildren } from 'react';

import { useCreateUser, useEffect, useLocalStorageByUser, useState } from 'hooks';
import { noop } from 'utils';

import { User } from 'types';
import { SelectedEntityContext } from './selectedEntityContext';
import { MDSnackbar } from 'components';
import { CurrentUserContext } from './currentUserContext';

interface UserWithSetter {
  isAddingUser: boolean;
  setIsAddingUser: (isAddingUser: boolean) => void;
  createUser?: Function;
  userNameInput?: string;
  setUserNameInput: (userNameInput?: string) => void;
  updatingUser?: User;
  setUpdatingUser?: (updatingUser?: User) => void;
  isSuccessCreateUser?: boolean;
  isLoadingCreateUser?: boolean;
  isUpdatingUser: boolean | '';
  setIsUpdatingUser: (isUpdatingUser: boolean) => void;
  emailInput: string | '';
  setEmailInput: (emailInput: string) => void;

  lastNameInput: string | '';
  setLastNameInput: (lastNameInput: string) => void;

  // Table Data
  userPageNumber: number;

  isUsersLoading: boolean;
  setUserPageNumber: (userPageNumber: number) => void;
  defaultEntriesPerPage: number;
  setDefaultEntriesPerPage: (defaultEntriesPerPage: number) => void;
  userRenderSuccessNotification: JSX.Element | undefined;
  userRenderErrorNotification: JSX.Element | undefined;
}

export const UserContext = createContext<UserWithSetter>({
  isAddingUser: false,
  setIsAddingUser: noop,
  createUser: noop,
  userNameInput: '',
  setUserNameInput: noop,
  updatingUser: undefined,
  setUpdatingUser: noop,
  isSuccessCreateUser: false,
  isLoadingCreateUser: false,
  isUpdatingUser: false,
  setIsUpdatingUser: noop,
  // onNameEditSubmit: noop,
  emailInput: undefined,
  setEmailInput: noop,
  lastNameInput: undefined,
  setLastNameInput: noop,

  // Table Data
  userPageNumber: undefined,
  setUserPageNumber: noop,
  defaultEntriesPerPage: 10,
  setDefaultEntriesPerPage: noop,
  isUsersLoading: false,
  userRenderSuccessNotification: undefined,
  userRenderErrorNotification: undefined,
});

interface Props {}

export const UserContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedDeploymentId } = useContext(SelectedEntityContext);

  const [updatingUser, setUpdatingUser] = useState<User | undefined>(undefined);
  const [isUpdatingUser, setIsUpdatingUser] = useState<boolean | undefined>(false);
  const [isAddingUser, setIsAddingUser] = useState<boolean | undefined>(false);

  const [userPageNumber, setUserPageNumber] = useLocalStorageByUser<number>(
    currentUser.id,
    `UsersPageFor${selectedDeploymentId}`,
    0
  );
  const [defaultEntriesPerPage, setDefaultEntriesPerPage] = useLocalStorageByUser<number>(
    currentUser.id,
    'UsersDefaultEntriesPerPage',
    5
  );
  const [userNameInput, setUserNameInput] = useState<string | undefined>('');

  const [emailInput, setEmailInput] = useState<string | undefined>(undefined);
  const [lastNameInput, setLastNameInput] = useState<string | undefined>(undefined);

  const [isSuccessCreateUserSnackbar, setIsSuccessCreateUserSnackbar] = useState<boolean>(false);
  const [isFailureCreateUserSnackbar, setFailureCreateUserSnackbarMessage] =
    useState<string>(undefined);


  const {
    data: dataCreateUser,
    error: errorCreateUser,
    isLoading: isLoadingCreateUser,
    isSuccess: isSuccessCreateUser,
    mutate: createUserCall,
  } = useCreateUser(emailInput, userNameInput);

  const createUser = () => {
    createUserCall();
    setIsAddingUser(false);
  };

  const cleanup = () => {
    setUserNameInput(undefined);
    setEmailInput(undefined);
    setLastNameInput(undefined);
  };

  useEffect(() => {
    if (dataCreateUser) {
      cleanup();
      setIsSuccessCreateUserSnackbar(true);
    }
  }, [dataCreateUser]);

  useEffect(() => {
    if (errorCreateUser) {
      // @ts-ignore
      errorCreateUser?.errors.length
        ? // @ts-ignore
          setFailureCreateUserSnackbarMessage(errorCreateUser?.errors[0].source)
        : setFailureCreateUserSnackbarMessage('Please try again');
    }
  }, [errorCreateUser]);

  const userRenderSuccessNotification = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successful Creation!"
      content="An Email has been sent to the user to accept."
      dateTime="Now"
      open={isSuccessCreateUserSnackbar}
      onClose={() => setIsSuccessCreateUserSnackbar(false)}
      close={() => setIsSuccessCreateUserSnackbar(false)}
      bgWhite
    />
  );

  const userRenderErrorNotification = (
    <MDSnackbar
      color="error"
      icon="x"
      title="Error During User Creation"
      content="Please try again."
      dateTime="Now"
      open={!!isFailureCreateUserSnackbar}
      onClose={() => setFailureCreateUserSnackbarMessage(undefined)}
      close={() => setFailureCreateUserSnackbarMessage(undefined)}
      bgWhite
    />
  );

  return (
    <UserContext.Provider
      value={{
        isAddingUser,
        setIsAddingUser,
        updatingUser,
        setUpdatingUser,
        createUser,
        isSuccessCreateUser,
        isLoadingCreateUser,
        isUpdatingUser,
        setIsUpdatingUser,

        userNameInput,
        setUserNameInput,
        emailInput,
        setEmailInput,
        lastNameInput,
        setLastNameInput,
        userPageNumber,
        setUserPageNumber,
        defaultEntriesPerPage,
        setDefaultEntriesPerPage,
        isUsersLoading: isLoadingCreateUser,
        userRenderSuccessNotification,
        userRenderErrorNotification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
