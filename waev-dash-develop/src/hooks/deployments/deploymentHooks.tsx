import { ApiLoaderContext, DeploymentContext, NotificationContext } from 'contexts';
import {
  useCallback,
  useContext,
  useListOrganizations,
  useMutation,
  useQueryClient,
  useStrictQuery,
} from 'hooks';
import { Deployment, DeploymentPermissions } from 'types';
import {
  ApiResponse,
  DeploymentConfig,
  DeploymentPayload,
  DeploymentSubmitPayload,
  ResponseDeployment,
  ResponseDeployments,
  WaevErrors,
  RootStateType,
} from 'types';
import {
  apiCreateDeployment,
  apiDeleteDeployment,
  apiGetDeploymentById,
  apiGetDeployments,
  apiUpdateDeployment,
} from 'network';
import { deepCopy } from 'utils';
import { useSelector } from 'react-redux';

export const useListDeployments = (organizationId?: string, options?: {}) => {
  const queryClient = useQueryClient();

  return useStrictQuery<ResponseDeployments, WaevErrors, Deployment[] | [] | undefined>(
    ['Deployments', organizationId],
    // @ts-ignore
    () => {
      if (!organizationId) {
        return Promise.reject({
          errors: [
            { details: 'No Valid Organization ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseDeployment);
      }
      return apiGetDeployments(organizationId);
    },
    {
      select: useCallback((result) => {
        (result?.included || []).forEach((include: any) => {
          if (include.type === 'deployment_permissions') {
            const index = result.data.findIndex(
              (dep: Deployment) => dep.id === include.attributes.deployment_id
            );
            if (index > -1) {
              if (result.data[index]?.fullPermissions) {
                result.data[index].fullPermissions.findIndex(
                  (perm: DeploymentPermissions) => perm.id === include.id
                ) === -1 && result.data[index].fullPermissions.push(include);
              } else {
                result.data[index].fullPermissions = [include];
              }
            }
          }
        });
        return result.data;
      }, []),
      onError: (error) => {
        console.error('getDeployments Error', error);
      },
      onSuccess: (results) => {
        results?.forEach((result) => {
          queryClient.setQueryData(['SelectedDeployment', organizationId, result.id], {
            data: result,
          });
        });
      },
      refetchOnWindowFocus: false,
      enabled: !!organizationId,
      ...options,
    }
  );
};

export const useGetDeployment = (
  organizationId?: string,
  deploymentId?: string,
  isRefetch?: boolean,
  options?: {}
) => {
  const queryClient = useQueryClient();

  return useStrictQuery<ResponseDeployment, WaevErrors, Deployment | undefined>(
    ['SelectedDeployment', organizationId, deploymentId],
    // @ts-ignore
    () => {
      if (!deploymentId || !organizationId) {
        return Promise.resolve({
          errors: [
            { details: 'No Valid Deployment ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseDeployment);
      }
      if (isRefetch) {
        return apiGetDeploymentById(organizationId, deploymentId);
      }
      const query = queryClient.getQueryData<ResponseDeployment>([
        'SelectedDeployment',
        organizationId,
        deploymentId,
      ]);

      if (query?.data.id) {
        return Promise.resolve({ data: query.data });
      }
      return Promise.resolve({});
    },
    {
      retry: false,
      select: (result) => {
        return result.data;
      },
      refetchOnWindowFocus: false,
      enabled: !!deploymentId && !!organizationId,
      onError: (error) => {
        console.error('useGetDeployment Error', error);
      },
      onSuccess: (result) => {
        // console.info('---- useGetDeployment result:', result);
      },
      ...options,
    }
  );
};

export const useCreateDeployment = (
  name: string,
  organizationId: string,
  config?: DeploymentConfig,
  options?: {}
) => {
  const { setDeploymentNameInput } = useContext(DeploymentContext);
  const { setIsBlockingLoader } = useContext(ApiLoaderContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);

  const { refetch: getDeployments } = useListDeployments(organizationId);
  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  return useMutation<ResponseDeployment, WaevErrors>(
    // @ts-ignore
    async () => {
      if (!name || !organizationId) {
        return Promise.reject({
          errors: [{ details: 'No Name/Org Defined', title: 'Bad Request', status: 400 }],
        } as ResponseDeployment);
      }
      if (name === 'Error') {
        return Promise.reject({
          errors: [
            {
              details: 'No Name of Deployment Defined',
              title: 'Bad Request for name',
              status: 400,
            },
          ],
        } as ResponseDeployment);
      }
      setIsBlockingLoader(true);
      const payload: DeploymentPayload = {
        data: {
          type: 'deployments',
          attributes: {
            name,
          },
        },
      };

      if (config) {
        payload.data.attributes.config = config;
      }
      return apiCreateDeployment(payload, organizationId);
    },
    {
      onMutate: async () => {
        // Cancels all currently running queries
        await queryClient.cancelQueries(['Deployments', organizationId]);
      },
      onSuccess: (result) => {
        setSuccessNotification({
          title: 'Success',
          message: 'Successfully Queued to Create',
        });
        if (result?.data?.id) {
          // Manually adds the result to the list of OrganizationDeployments
          queryClient.setQueryData(['Deployments', organizationId], (old: ResponseDeployments) => {
            const dep = {
              id: result.data.id,
              type: 'deployments',
              attributes: {
                name,
                organization_id: organizationId,
              },
            } as Deployment;
            old.data.push(dep);
            return old;
          });
          getDeployments();
          getOrganizations();
        }
      },
      onSettled: () => {
        setDeploymentNameInput(undefined);
        setIsBlockingLoader(false);
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Create Deployment Error',
          message: error?.errors[0].title || 'Could not create deployment.',
        });
      },
      ...options,
    }
  );
};

export const useUpdateDeployment = (
  deployment?: Deployment,
  nameInput?: string,
  config?: any,
  organizationId?: string,
  options?: {}
) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);

  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const { refetch: getDeployments } = useListDeployments(organizationId);
  const queryClient = useQueryClient();

  return useMutation<ResponseDeployment, WaevErrors>(
    // @ts-ignore
    async () => {
      if (!deployment) {
        return Promise.reject();
      }
      const payload: DeploymentSubmitPayload = {
        data: {
          type: 'deployments',
          attributes: {
            name: nameInput,
            config: config,
          },
        },
      };
      return apiUpdateDeployment(organizationId, deployment.id, payload);
    },
    {
      onMutate: () => {
        // Preserves old data in case of rollback
        const previousSnapshot: ResponseDeployment = queryClient.getQueryData([
          'SelectedDeployment',
          organizationId,
          deployment.id,
        ]);
        const prevClone = deepCopy(previousSnapshot);

        // Optimistically updates the attributes of the Deployment
        queryClient.setQueryData(
          ['SelectedDeployment', organizationId, deployment.id],
          (old: ResponseDeployment) => {
            old.data.attributes = {
              name: nameInput,
              config: config,
            };
            return old;
          }
        );
        return prevClone;
      },
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'Deployment Updated',
          });
        }
      },
      onError: (_error, _i, context: ResponseDeployment) => {
        // Rolls back the changes in the Deployment.
        queryClient.setQueryData(
          ['SelectedDeployment', organizationId, deployment.id],
          () => context
        );
        // Rolls back the name change in the Deployments record
        queryClient.setQueryData(['Deployments', organizationId], (old: ResponseDeployments) => {
          const objIndex =
            old?.data && old.data.findIndex((dep: Deployment) => dep.id === deployment?.id);
          if (old && old.data[objIndex].attributes) {
            old.data[objIndex] = context.data;
          }
          return old;
        });
        setErrorNotification({
          title: 'Update Deployment Error',
          message: 'Could not update deployment.',
        });
      },
      onSettled: () => {
        getOrganizations();
        getDeployments();
      },
      ...options,
    }
  );
};

export const useDeleteDeployment = (
  deploymentId?: string,
  organizationId?: string,
  onCleanup?: (test: boolean) => void,
  options?: {}
) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { refetch: getDeployments } = useListDeployments(organizationId);
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!deploymentId) {
        return Promise.reject();
      }
      return apiDeleteDeployment(organizationId, deploymentId);
    },
    {
      onMutate: async () => {
        // Cancels all currently running queries
        await queryClient.cancelQueries(['Deployments', organizationId]);
        await queryClient.cancelQueries(['Deployment', deploymentId]);

        // Preserves old data in case of rollback
        const previousSnapshot: ResponseDeployment = queryClient.getQueryData([
          'SelectedDeployment',
          organizationId,
          deploymentId,
        ]);
        const prevClone = deepCopy(previousSnapshot);

        // Optimistically deletes the Organization
        queryClient.setQueryData(['Deployments', organizationId], (old: ResponseDeployments) => {
          const updated = old.data.filter((dep: Deployment) => dep.id !== deploymentId);
          return { ...old, data: updated };
        });
        onCleanup(true);
        return prevClone;
      },
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'Deployment Deleted',
          });
          getDeployments();
        }
      },
      onError: (_error, _i, context: ResponseDeployment) => {
        setErrorNotification({
          title: 'Delete Deployment Error',
          message: 'Could not delete deployment.',
        });

        // Rolls back the changes in the Deployment.
        queryClient.setQueryData(
          ['SelectedDeployment', organizationId, deploymentId],
          () => context
        );

        // Rolls back the delete in the Deployments record
        queryClient.setQueryData(['Deployments', organizationId], (old: ResponseDeployments) => {
          old.data.push(context.data);
          return old;
        });
        getDeployments();
      },
      ...options,
    }
  );
};
