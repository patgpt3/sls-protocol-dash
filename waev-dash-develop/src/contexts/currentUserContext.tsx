/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, PropsWithChildren, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from 'store';

import {
  useEffect,
  useGetCurrentUser,
  useListOrganizations,
  useLocalStorage,
  useLocalStorageByUser,
  useRefreshToken,
  useUpdateUser,
} from 'hooks';
import { noop } from 'utils';
import sec from 'utils/token';

import { CurrentUser as CurrentUserType, RootStateType } from 'types';

interface CurrentUserWithSetter {
  token?: string;
  currentUser: CurrentUserType;
  setCurrentUser: (user: CurrentUserType) => void;
  logout: () => void;
  isBeta: boolean | undefined;
  isWaevAdmin: boolean | undefined;
  dataGetMe: CurrentUserType;
  firstNameInput: string | '';
  setFirstNameInput: (firstNameInput: string) => void;
  lastNameInput: string | '';
  setLastNameInput: (lastNameInput: string) => void;
  updateUser: boolean;
  setUpdateUser: (updateUser: boolean) => void;
  updateUserNames: () => void;
}

export const CurrentUserContext = createContext<CurrentUserWithSetter>({
  token: null,
  currentUser: undefined,
  setCurrentUser: noop,
  logout: noop,
  isBeta: false,
  isWaevAdmin: false,
  dataGetMe: undefined,
  firstNameInput: undefined,
  setFirstNameInput: noop,
  lastNameInput: undefined,
  setLastNameInput: noop,
  updateUser: undefined,
  setUpdateUser: noop,
  updateUserNames: noop,
});

interface Props {
  value?: CurrentUserWithSetter;
}

export const CurrentUserContextProvider = ({
  children,
  value,
}: PropsWithChildren<Props>): JSX.Element => {
  const [firstNameInput, setFirstNameInput] = useState<string | undefined>(undefined);
  const [lastNameInput, setLastNameInput] = useState<string | undefined>(undefined);
  const [updateUser, setUpdateUser] = useState<boolean | undefined>(undefined);
  const [currentUser, setCurrentUser] = useLocalStorage<CurrentUserType | undefined>(
    'currentUser',
    undefined
  );

  const [isBeta, _setIsBeta] = useLocalStorageByUser<boolean | undefined>(
    currentUser?.id,
    'isBeta',
    undefined
  );
  const [isWaevAdmin, _setIsWaevAdmin] = useLocalStorageByUser<boolean | undefined>(
    currentUser?.id,
    'isAdmin',
    undefined
  );
  const dispatch = useDispatch();

  const token = currentUser?.attributes?.token ?? null;

  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);

  const { data: refreshedToken } = useRefreshToken(currentUser?.id);

  const { data: dataGetMe } = useGetCurrentUser(currentUser?.id);
  const { mutate: updateUserCall } = useUpdateUser(currentUser?.id, firstNameInput, lastNameInput);

  useEffect(() => {
    // When token is automatically refreshed, we update the stored token
    if (refreshedToken) {
      const user: CurrentUserType = {
        ...currentUser,
        attributes: {
          ...currentUser.attributes,
          token: refreshedToken,
        },
      };
      setCurrentUser(user);
      dispatch(setUserData(user));
      sec.setAccessTokenSilently(() => Promise.resolve(refreshedToken));
    }
  }, [refreshedToken]);

  const logout = () => {
    sessionStorage.setItem('is-authenticated', 'false');
    window.localStorage.setItem('jwtStoreTime', null);
    dispatch(setUserData(null));
    if (!window.location.pathname.startsWith('/magiclink')) {
      window.location.href = '/magiclink';
    }
  };

  const updateUserNames = () => {
    updateUserCall();
    setUpdateUser(undefined);
    setFirstNameInput('');
    setLastNameInput('');
  };

  useEffect(() => {
    if (currentUser) {
      dispatch(setUserData(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    // Sets token to be able to be pulled from outside of context.
    sec.setAccessTokenSilently(() => Promise.resolve(token));
    if (token) {
      getOrganizations();
    }
  }, [token]);

  return (
    <CurrentUserContext.Provider
      value={{
        token,
        currentUser,
        setCurrentUser,
        logout,
        isBeta,
        isWaevAdmin,
        ...value,
        dataGetMe,
        firstNameInput,
        setFirstNameInput,
        lastNameInput,
        setLastNameInput,
        updateUser,
        setUpdateUser,
        updateUserNames,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
