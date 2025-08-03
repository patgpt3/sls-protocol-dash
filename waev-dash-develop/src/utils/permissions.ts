import { PermissionKeys, WaevPermissions } from 'types';

export const isAllowed = (permissions: WaevPermissions, accepted: PermissionKeys[]) => {
  return accepted?.length && accepted.some((accept) => permissions.attributes.permissions[accept]);
};

export const isUserAllowed = (
  permissions: WaevPermissions[],
  id: string,
  accepted: PermissionKeys[]
) => {
  const p = permissions?.find((permission) => permission?.attributes.users?.email === id);

  if (p?.attributes.permissions) {
    return accepted.some((accept) => p.attributes.permissions[accept]);
  }
  return false;
};

export const restrictUser = (
  permissions: WaevPermissions[],
  id: string,
  accepted: PermissionKeys[],
  child: JSX.Element
) => (isUserAllowed(permissions, id, accepted) ? child : undefined);
