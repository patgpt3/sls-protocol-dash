import {
  ApiLoaderContext,
  CurrentUserContext,
  DeploymentContext,
  OptInFlagContextProvider,
  OrganizationContext,
  PermissionContext,
  RecordContext,
  SelectedEntityContext,
} from 'contexts';
import {
  useListDeployments,
  useListOrganizations,
  useLocalStorageByUser,
  useListOptInFlags,
} from 'hooks';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
// import { TourPopper } from 'components';
import useCounterReducer from 'hooks/utils/useCounterReducer';

interface HandholdModeFlags {
  isHandhold: boolean;
  isFirstVisit: boolean;
  helpOverride: boolean;
}
export interface CheckFlags {
  isFirstVisitCheck: boolean | undefined;

  isHomeSelect: boolean;
  isSettingsSelect: boolean;
  isDeploymentsSelect: boolean;
  isViewDataSelect: boolean;
}

interface TourWithSetter {
  onHelpClick?: () => void;
  setCheckFlags?: (checkFlags: CheckFlags) => void;
  isHiddenPoppers?: boolean;
  setIsHiddenPoppers?: (isHiddenPoppers: boolean) => void;
  popperCount?: number;
  doPopperAction?: (action: 'increment' | 'decrement' | 'reset') => void;
  defaultFlags: HandholdModeFlags;
  checkFlags: CheckFlags;
  onSelectCall?: (checkFlags: CheckFlags) => void;
  useCounterReducer?: () => void;
  isIncompleteTask?: boolean;
  isHelpDisabled?: boolean;
}

export const TourContext = createContext<TourWithSetter>({
  defaultFlags: {
    isHandhold: undefined,
    helpOverride: undefined,
    isFirstVisit: undefined,
  },
  checkFlags: {
    isFirstVisitCheck: undefined,
    isHomeSelect: undefined,
    isSettingsSelect: undefined,
    isDeploymentsSelect: undefined,
    isViewDataSelect: undefined,
  },
  onHelpClick: () => (): void => {},
  setCheckFlags: () => (): void => {},
  onSelectCall: () => (): void => {},
  isHiddenPoppers: undefined,
  setIsHiddenPoppers: () => (): void => {},
  popperCount: 0,
  doPopperAction: () => (): void => {},
  useCounterReducer: () => (): void => {},
  isIncompleteTask: undefined,
  isHelpDisabled: undefined,
});

interface Props {}

export const TourContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const {
    selectedOrganizationId,
    selectedOrganization,
    selectedDeploymentId,
    setSelectedDeploymentId,
  } = useContext(SelectedEntityContext);
  const { currentUser, token } = useContext(CurrentUserContext);
  const { isAddingOrg } = useContext(OrganizationContext);
  const { addingPermissionsType } = useContext(PermissionContext);
  const { isAddingDeployment, updatingDeployment, isLoadingDeployment } =
    useContext(DeploymentContext);
  const { selectedEntity } = useContext(RecordContext);
  const { isLoadingGlobal, isFirstLoad } = useContext(ApiLoaderContext);

  const { data: organizations } = useListOrganizations(currentUser, token);
  const { data: deployments } = useListDeployments(selectedOrganizationId);
  const { data: optInFlags } = useListOptInFlags(selectedDeploymentId);
  //when Organization is deleted, SelectedDeploymentId is be cleared
  useEffect(() => {
    if (!selectedOrganizationId) {
      setSelectedDeploymentId(undefined);
    }
  }, [selectedDeploymentId]);

  const [isHiddenPoppers, setIsHiddenPoppers] = useState<boolean>(false);
  const [isIncompleteTask, setIsInCompleteTask] = useState<boolean>(false);
  const [initialPopper, setInitialPopper] = useState<boolean>(false);
  const [isHelpDisabled, setIsHelpDisabled] = useState<boolean>(false);
  const [popperCount, doPopperAction] = useCounterReducer();
  const [checkFlags, setCheckFlags] = useLocalStorageByUser<CheckFlags | undefined | null>(
    currentUser?.id,
    'checkFlags',
    {
      isFirstVisitCheck: false,
      isHomeSelect: false,
      isSettingsSelect: false,
      isDeploymentsSelect: false,
      isViewDataSelect: false,
    }
  );

  const [defaultFlags, setDefaultFlags] = useLocalStorageByUser<
    HandholdModeFlags | undefined | null
  >(currentUser?.id, 'flags', {
    isHandhold: false,
    isFirstVisit: true,
    helpOverride: false,
  });

  const onHelpClick = () => {
    if (popperCount > 0) {
      doPopperAction('reset');
      setInitialPopper(false);
    }
    defaultFlags.isFirstVisit
      ? setDefaultFlags({
          ...defaultFlags,
          isHandhold: !defaultFlags.isHandhold,
          helpOverride: !defaultFlags.helpOverride,
        })
      : !isLoadingGlobal &&
        isFirstLoad &&
        setDefaultFlags({
          ...defaultFlags,
          isHandhold: !defaultFlags.isHandhold,
          helpOverride: !defaultFlags.helpOverride,
        });

    setIsHiddenPoppers(false);
  };

  // useEffect(() => {
  //   !defaultFlags.isFirstVisit &&
  //     setDefaultFlags({
  //       ...defaultFlags,
  //       ...{
  //         isHandhold: false,
  //         helpOverride: false,
  //       },
  //     });
  // }, [!isFirstLoad]);

  //start tour on first visit to new account
  useEffect(() => {
    if (checkFlags.isHomeSelect && defaultFlags.isFirstVisit && !defaultFlags.isHandhold) {
      onHelpClick();
    }
  }, [checkFlags.isHomeSelect, defaultFlags.isFirstVisit]);

  //turns off tour if all messages are closed individually
  useEffect(() => {
    if (
      popperCount === 0 &&
      defaultFlags.isHandhold &&
      initialPopper &&
      !isAddingDeployment &&
      !isAddingOrg &&
      !isLoadingDeployment &&
      !addingPermissionsType &&
      !isLoadingGlobal &&
      isFirstLoad
    ) {
      onHelpClick();
    }
  }, [initialPopper, popperCount]);

  //checks if Poppers load initially before checking if all messages are deleted
  useEffect(() => {
    if (popperCount >= 1) {
      setInitialPopper(true);
    }
  }, [popperCount]);

  const onSelectCall = (flagsObject: CheckFlags) => {
    setCheckFlags(flagsObject);
  };

  //badge for incomplete tasks
  useEffect(() => {
    if (!(organizations?.length > 0)) {
      setIsInCompleteTask(true);
    }
    if (deployments && deployments?.length === 0) {
      setIsInCompleteTask(true);
    }
    if (optInFlags?.length > 0) {
      setIsInCompleteTask(false);
    }
    if (optInFlags?.length > 0 && !defaultFlags.isHandhold) {
      checkFlags.isHomeSelect ? setIsHelpDisabled(true) : setIsHelpDisabled(false);
    }
  });

  //reset for each page
  useEffect(() => {
    if (
      !isLoadingGlobal &&
      (!(organizations?.length > 0) ||
        (deployments && deployments?.length === 0) ||
        (optInFlags && !(optInFlags?.length > 0)))
    ) {
      checkFlags.isHomeSelect && onHelpClick();
      checkFlags.isHomeSelect && onHelpClick();
    }
    if (optInFlags?.length > 0) {
      defaultFlags.isHandhold && onHelpClick();
    }
  }, [checkFlags.isHomeSelect]);
  useEffect(() => {
    if (
      !isLoadingGlobal &&
      (!(organizations?.length > 0) ||
        (deployments && deployments?.length === 0) ||
        (optInFlags && !(optInFlags?.length > 0)))
    ) {
      checkFlags.isSettingsSelect && onHelpClick();
      checkFlags.isSettingsSelect && onHelpClick();
    }
  }, [checkFlags.isSettingsSelect]);
  useEffect(() => {
    if (
      !isLoadingGlobal &&
      (!(organizations?.length > 0) ||
        (deployments && deployments?.length === 0) ||
        (optInFlags && !(optInFlags?.length > 0)))
    ) {
      checkFlags.isDeploymentsSelect && onHelpClick();
      checkFlags.isDeploymentsSelect && onHelpClick();
    }
  }, [checkFlags.isDeploymentsSelect]);
  useEffect(() => {
    if (
      !isLoadingGlobal &&
      (!(organizations?.length > 0) ||
        (deployments && deployments?.length === 0) ||
        (optInFlags && !(optInFlags?.length > 0)))
    ) {
      checkFlags.isViewDataSelect && onHelpClick();
      checkFlags.isViewDataSelect && onHelpClick();
    }
  }, [checkFlags.isViewDataSelect]);

  useEffect(() => {
    //Home
    if (
      defaultFlags.isFirstVisit &&
      deployments &&
      deployments?.length > 0 &&
      (checkFlags.isSettingsSelect || checkFlags.isDeploymentsSelect || checkFlags.isViewDataSelect)
    ) {
      setDefaultFlags({
        ...defaultFlags,
        isFirstVisit: false,
      });
      setCheckFlags({
        ...checkFlags,

        isHomeSelect: false,
      });
    }
  }, [defaultFlags, checkFlags]);

  return (
    <TourContext.Provider
      value={{
        defaultFlags,
        onHelpClick,
        checkFlags,
        setCheckFlags,
        onSelectCall,
        isHiddenPoppers,
        setIsHiddenPoppers,
        popperCount,
        doPopperAction,
        useCounterReducer,
        isIncompleteTask,
        isHelpDisabled,
      }}
    >
      {/* Render Poppers: */}

      {/* Home */}
      <OptInFlagContextProvider>
        {/* {defaultFlags.isHandhold && checkFlags.isHomeSelect && (
          <>
            <TourPopper
              isEnabled={!organizations || organizations?.length === 0}
              open={defaultFlags.isHandhold}
              horizontalOffset={66}
              verticalOffset={20}
              arrowOffset={373}
              icon={'settings'}
              message={'To start, create an Organization in Settings'}
              elementId={'settingsNavIcon'}
            />
            {optInFlags && !(optInFlags?.length > 0) && (
              <TourPopper
                isEnabled={deployments && deployments?.length > 0 && !(optInFlags?.length > 0)}
                open={defaultFlags.isHandhold}
                horizontalOffset={66}
                verticalOffset={20}
                arrowOffset={301}
                icon={'rocket_launch'}
                message={'Add opt-in fields for your data here'}
                elementId={'deploymentsNavIcon'}
              />
            )}
            <TourPopper
              isEnabled={organizations?.length > 0 && deployments?.length === 0}
              open={defaultFlags.isHandhold}
              horizontalOffset={126}
              verticalOffset={20}
              arrowOffset={373}
              icon={'rocket_launch'}
              message={'To start collecting data, create a Deployment here'}
              elementId={'deploymentsNavIcon'}
            />
          </>
        )} */}

        {/* Settings */}

        {/* {defaultFlags.isHandhold && checkFlags.isSettingsSelect && (
          <>
            <TourPopper
              isEnabled={organizations?.length === 0 && !isAddingOrg}
              open={defaultFlags.isHandhold}
              horizontalOffset={16}
              verticalOffset={20}
              arrowOffset={208}
              message={'Add a new Organization here'}
              elementId={'createOrg'}
            />
            <TourPopper
              isEnabled={!!(organizations?.length > 0) && deployments?.length === 0}
              open={defaultFlags.isHandhold}
              horizontalOffset={126}
              verticalOffset={20}
              arrowOffset={280}
              icon={'rocket_launch'}
              message={'Now you can create a Deployment here'}
              elementId={'deploymentsNavIcon'}
            />
            <TourPopper
              isEnabled={!!(organizations?.length > 0) && !addingPermissionsType}
              open={defaultFlags.isHandhold}
              horizontalOffset={69}
              verticalOffset={10}
              arrowOffset={483}
              message={'You can grant other users access to this Organization here'}
              elementId={'addEnUser'}
            />
            {optInFlags && !(optInFlags?.length > 0) && (
              <TourPopper
                isEnabled={deployments && deployments?.length > 0 && !(optInFlags?.length > 0)}
                open={defaultFlags.isHandhold}
                horizontalOffset={66}
                verticalOffset={20}
                arrowOffset={301}
                icon={'rocket_launch'}
                message={'Add opt-in fields for your data here'}
                elementId={'deploymentsNavIcon'}
              />
            )}
          </>
        )} */}
        {/* Deployments */}

        {/* {defaultFlags.isHandhold && checkFlags.isDeploymentsSelect && (
          <>
            <TourPopper
              isEnabled={organizations?.length === 0}
              open={defaultFlags.isHandhold}
              horizontalOffset={66}
              verticalOffset={20}
              arrowOffset={372}
              icon={'settings'}
              message={'To start, create an Organization in Settings'}
              elementId={'settingsNavIcon'}
            />
            {deployments &&
              !isAddingDeployment &&
              !updatingDeployment &&
              deployments?.length === 0 && (
                <TourPopper
                  isEnabled={
                    deployments?.length === 0 && selectedOrganization && !isLoadingDeployment
                  }
                  open={defaultFlags.isHandhold}
                  horizontalOffset={36}
                  verticalOffset={20}
                  arrowOffset={250}
                  message={'Click here to create a Deployment'}
                  elementId={'addDep'}
                />
              )}
            {optInFlags?.length > 0 && (
              <>
                <TourPopper
                  isEnabled={optInFlags?.length > 0}
                  open={defaultFlags.isHandhold}
                  horizontalOffset={-281}
                  verticalOffset={-40}
                  arrowOffset={313}
                  placement={'top'}
                  message={'Make sure your implementation is in place to capture your data'}
                  elementId={'loader'}
                  isHideArrow={true}
                />
                <TourPopper
                  isEnabled={optInFlags?.length > 0}
                  open={defaultFlags.isHandhold}
                  horizontalOffset={66}
                  verticalOffset={20}
                  arrowOffset={284}
                  icon={'data_object'}
                  message={'You can view incoming data here'}
                  elementId={'dataNavIcon'}
                />
              </>
            )}

            {deployments && deployments?.length > 0 && (
              <>
                <TourPopper
                  isEnabled={!(optInFlags?.length > 0)}
                  open={defaultFlags.isHandhold}
                  horizontalOffset={-116}
                  verticalOffset={20}
                  arrowOffset={295}
                  placement={'top'}
                  arrowPlacement={'bottom'}
                  message={'You can add the opt-in fields here'}
                  elementId={'editbuttonId'}
                />

                <TourPopper
                  isEnabled={deployments?.length > 0}
                  open={defaultFlags.isHandhold}
                  horizontalOffset={246}
                  verticalOffset={20}
                  arrowOffset={33}
                  placement={'top'}
                  arrowPlacement={'bottom'}
                  message={'You can grant other users access to this Deployment here'}
                  elementId={'addDepUserButton'}
                />
                <TourPopper
                  isEnabled={
                    deployments &&
                    deployments?.length > 0 &&
                    !(optInFlags?.length > 0) &&
                    !isAddingDeployment
                  }
                  open={defaultFlags.isHandhold}
                  horizontalOffset={-2000}
                  verticalOffset={-40}
                  arrowOffset={313}
                  placement={'top'}
                  message={
                    'Select the fields you want opt-in information for to be stored on-chain'
                  }
                  elementId={'loader'}
                  isHideArrow={true}
                />
              </>
            )}
          </>
        )} */}

        {/* View Data */}

        {/* {defaultFlags.isHandhold && checkFlags.isViewDataSelect && (
          <>
            <TourPopper
              isEnabled={organizations?.length === 0}
              open={defaultFlags.isHandhold}
              horizontalOffset={66}
              verticalOffset={20}
              arrowOffset={372}
              icon={'settings'}
              message={'To start, create an Organization in settings'}
              elementId={'settingsNavIcon'}
            />
            {optInFlags && !(optInFlags?.length > 0) && (
              <TourPopper
                isEnabled={deployments && deployments?.length > 0 && !(optInFlags?.length > 0)}
                open={defaultFlags.isHandhold}
                horizontalOffset={66}
                verticalOffset={20}
                arrowOffset={301}
                icon={'rocket_launch'}
                message={'Add opt-in fields for your data here'}
                elementId={'deploymentsNavIcon'}
              />
            )}
            <TourPopper
              isEnabled={organizations?.length > 0 && deployments?.length === 0}
              open={defaultFlags.isHandhold}
              horizontalOffset={126}
              verticalOffset={20}
              arrowOffset={375}
              icon={'rocket_launch'}
              message={'To start collecting data, create a Deployment here'}
              elementId={'deploymentsNavIcon'}
            />
            {optInFlags && optInFlags?.length > 0 && (
              <>
                <TourPopper
                  isEnabled={
                    deployments &&
                    deployments?.length > 0 &&
                    optInFlags?.length > 0 &&
                    !isAddingDeployment &&
                    !updatingDeployment &&
                    !!selectedEntity
                  }
                  open={defaultFlags.isHandhold}
                  horizontalOffset={126}
                  verticalOffset={20}
                  arrowOffset={438}
                  icon={'integration_instructions'}
                  message={'You can check the integrations documentation here'}
                  elementId={'docsNavIcon'}
                />
                <TourPopper
                  isEnabled={
                    deployments &&
                    deployments?.length > 0 &&
                    optInFlags?.length > 0 &&
                    !isAddingDeployment &&
                    !updatingDeployment &&
                    !selectedEntity
                  }
                  open={defaultFlags.isHandhold}
                  horizontalOffset={0}
                  verticalOffset={30}
                  arrowOffset={313}
                  placement={'top'}
                  message={`Select the Deployment or Group you'd like to view data for`}
                  elementId={'selectTable'}
                  isHideArrow={true}
                />
              </>
            )}
          </>
        )} */}
      </OptInFlagContextProvider>

      {children}
    </TourContext.Provider>
  );
};
