import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { BlockingLoader, WaevAvatar } from 'components';
import { useIsFetching, useIsMutating } from 'react-query';
import { fadeInKeyframes, fadeOutKeyframes, noop } from 'utils';

interface ApiLoaderWithSetter {
  renderLoader: JSX.Element | undefined;
  isLoadingGlobal: boolean;
  isFirstLoad: boolean;
  setIsBlockingLoader: (isBlockingLoader: boolean) => void;
  isBlockingLoader:boolean;
}

export const ApiLoaderContext = createContext<ApiLoaderWithSetter>({
  renderLoader: undefined,
  isLoadingGlobal: false,
  isFirstLoad: false,
  setIsBlockingLoader: noop,
  isBlockingLoader:false,
});

interface Props {
  value?: ApiLoaderWithSetter;
}

export const ApiLoaderContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const [isBlockingLoader, setIsBlockingLoader] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(false);

  useEffect(() => {
    setFirstLoad(true);
  });

  // const renderLoader = true ? (
  const renderLoader = isBlockingLoader ? (
    <BlockingLoader />
  ) : isFetching > 0 || isMutating > 0 ? (
    <WaevAvatar
      alt="profile-image"
      size="lg"
      shadow="sm"
      bgColor="info"
      isAnimating={true}
      fadeAnimation={`ease-in 0.5s ${fadeInKeyframes()}`}
      fadeOpacity={'1'}
      opacity="0.4"
    />
  ) : (
    firstLoad && (
      <WaevAvatar
        alt="profile-image"
        size="lg"
        shadow="sm"
        bgColor="info"
        isAnimating={true}
        fadeAnimation={`ease-out 0.5s ${fadeOutKeyframes()}`}
        fadeOpacity={'0'}
        opacity="0.4"
      />
    )
  );

  return (
    <ApiLoaderContext.Provider
      value={{
        renderLoader,
        isLoadingGlobal: isFetching > 0 || isMutating > 0,
        isFirstLoad: firstLoad,
        setIsBlockingLoader,
        isBlockingLoader,
      }}
    >
      {children}
    </ApiLoaderContext.Provider>
  );
};
