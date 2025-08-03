/**
  All of the routes for the Waev Dashboard are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav.
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

import {
  DeploymentContextProvider,
  DeploymentRecordContextProvider,
  DeploymentUserRecordsContextProvider,
  GroupContextProvider,
  GroupRecordContextProvider,
  OptInFlagContextProvider,
  OrganizationContextProvider,
  PermissionContextProvider,
  ProviderComposer,
  RecordContextProvider,
  UserContextProvider,
  UnionContextProvider,
} from 'contexts';
import {
  // Domains,
  //JsBlob
  CreateData,
  Deployments,
  Documentation,
  Home,
  Settings,
  SignInBasic,
  ViewData,
  Unions,
  ViewUnionData,
} from 'layouts';
import { CurrentUser } from 'types';
import { WaevUserIcon, WaevPlaceholderIcon, waevHoverClass, MDBox } from 'components';

// @mui icons
import Icon from '@mui/material/Icon';
import { AdminPanel } from 'layouts/admin';
import { TourContextProvider } from 'contexts/tourContext';
import { RouteObject } from 'react-router-dom';

const routes = (currentUser: CurrentUser, getMe: CurrentUser, isAdmin?: boolean) => {
  let name =
    getMe?.attributes.first_name &&
    getMe?.attributes.last_name &&
    `${getMe?.attributes.first_name} ${getMe?.attributes.last_name}`;

  let email = currentUser?.attributes?.email;
  if (email && email.length > 19) email = email.slice(0, 18) + '...';
  if (name && name.length > 19) name = name.slice(0, 18) + '...';
  const routesArray = [
    {
      type: 'collapse',
      // @ts-ignore
      name: name || email || 'User',
      key: 'waev-user',
      isName: true,
      icon: currentUser?.id ? (
        <MDBox
          component="button"
          sx={{
            backgroundColor: 'transparent !important',
            border: 'none !important',
          }}
        >
          <WaevUserIcon id={currentUser?.attributes?.email} isToHex={true} size="sm" />
        </MDBox>
      ) : (
        <MDBox
          component="button"
          sx={{
            backgroundColor: 'transparent !important',
            border: 'none !important',
          }}
        >
          <WaevPlaceholderIcon alt="profile-image" size="sm" bgColor="info" />
        </MDBox>
      ),
      collapse: [
        // {
        //   name: 'My Profile',
        //   key: 'my-profile',
        //   route: '/pages/profile/profile-overview',
        //   component: <ProfileOverview />,
        // },
        {
          name: 'Settings',
          icon: <Icon fontSize="medium">settings</Icon>,
          key: 'profile-settings',
          route: '/pages/account/settings',
          component: (
            <ProviderComposer
              contexts={[
                <PermissionContextProvider />,
                <OrganizationContextProvider />,
                <TourContextProvider />,
                <OptInFlagContextProvider />,
                <DeploymentContextProvider />,
                <UserContextProvider />,
              ]}
            >
              <Settings />
            </ProviderComposer>
          ),
        },
        // {
        //   name: 'Create Organization',
        //   key: 'profile-settings',
        //   route: '/pages/account/settings/create-organization',
        //   component: (
        //     <OrganizationContextProvider>
        //       <OrganizationsWizard />
        //     </OrganizationContextProvider>
        //   ),
        // },
        {
          icon: <Icon fontSize="medium">logout</Icon>,
          name: 'Logout',
          key: 'logout',
          route: '/magiclink',
          component: <SignInBasic />,
        },
      ],
      sx: currentUser && waevHoverClass(currentUser?.attributes?.email),
    },

    { type: 'divider', key: 'divider-0' },

    // { type: "title", title: "Dashboard", key: "dashboard-title" },
    {
      name: 'Home',
      key: 'home',
      // icon: <Icon fontSize="medium">dashboard</Icon>,
      icon: <Icon fontSize="medium">home</Icon>,
      route: '/home',
      component: (
        <ProviderComposer contexts={[<TourContextProvider />, <OptInFlagContextProvider />]}>
          <Home />
        </ProviderComposer>
      ),

      // component: <Analytics />,
      // component: <Settings />,
      type: 'collapse',
      noCollapse: true,
    },
    // {
    //   name: 'Usage',
    //   key: 'usage',
    //   icon: <Icon fontSize="medium">data_usage</Icon>,
    //   route: '/usage',
    //   // component: <Sales />,
    //   component: <Charts />,
    //   type: 'collapse',
    //   noCollapse: true,
    // },

    // {
    //   type: 'collapse',
    //   name: 'Data',
    //   key: 'data',
    //   icon: <Icon fontSize="medium">data_object</Icon>,
    //   collapse: [
    //     {
    //       name: 'View Data',
    //       key: 'view-data',
    //       icon: <Icon fontSize="medium">data_object</Icon>,

    //       route: '/data/view-data',
    //       component: (
    //         <DeploymentRecordContextProvider>
    //           <ViewData />
    //         </DeploymentRecordContextProvider>
    //       ),
    //     },
    //     // {
    //     //   name: 'Share Data',
    //     //   key: 'share-data',
    //     //   route: '/data/share-data',
    //     //   component: <AllProjects />,
    //     // },
    //     // {
    //     //   name: 'Data Unions',
    //     //   key: 'data-unions',
    //     //   route: '/data/data-unions',
    //     //   component: <AllProjects />,
    //     // },
    //   ],
    // },
    // {
    //   name: 'Domains',
    //   key: 'domains',
    //   icon: <Icon fontSize="medium">public</Icon>,
    //   route: '/domains',
    //   // component: <Sales />,
    //   component: (
    //     <ProviderComposer
    //       contexts={[
    //         <OrganizationContextProvider />,
    //         <DomainContextProvider />,
    //         <PermissionContextProvider />,
    //       ]}
    //     >
    //       <Domains />
    //     </ProviderComposer>
    //   ),
    //   type: 'collapse',
    //   noCollapse: true,
    // },
    {
      name: 'Deployments',
      key: 'deployments',
      icon: <Icon fontSize="medium">rocket_launch</Icon>,
      route: '/deployments',
      // component: <Sales />,
      component: (
        <ProviderComposer
          contexts={[
            <OrganizationContextProvider />,
            <DeploymentContextProvider />,
            <OptInFlagContextProvider />,
            <PermissionContextProvider />,
            <GroupContextProvider />,
            <TourContextProvider />,
          ]}
        >
          <Deployments />
        </ProviderComposer>
      ),
      type: 'collapse',
      noCollapse: true,
    },
    {
      name: 'View Data',
      key: 'data',
      icon: <Icon fontSize="medium">data_object</Icon>,
      route: '/data/view-data',
      component: (
        <ProviderComposer
          contexts={[
            <OrganizationContextProvider />,
            <RecordContextProvider />,
            <DeploymentRecordContextProvider />,
            <GroupRecordContextProvider />,
            <DeploymentUserRecordsContextProvider />,
            <OptInFlagContextProvider />,
            <TourContextProvider />,
          ]}
        >
          <ViewData />
        </ProviderComposer>
      ),
      // component: <Settings />,
      type: 'collapse',
      noCollapse: true,
    },
    {
      name: 'Create Data',
      key: 'create-data',
      icon: <Icon fontSize="medium">control_point</Icon>,
      route: '/data/create-data',
      component: (
        <ProviderComposer
          contexts={[
            <DeploymentRecordContextProvider />,
            <OptInFlagContextProvider />,
            <OrganizationContextProvider />,
          ]}
        >
          <CreateData />
        </ProviderComposer>
      ),
      // component: <Settings />,
      type: 'collapse',
      noCollapse: true,
      // isHidden: true,
    },
    {
      name: 'Data Unions',
      key: 'data-unions',
      icon: <Icon fontSize="medium">group_work</Icon>,
      route: '/data-unions',
      component: (
        <ProviderComposer
          contexts={[
            <UnionContextProvider />,
            <OrganizationContextProvider />,
            <GroupContextProvider />,
            <UserContextProvider />,
          ]}
        >
          <Unions />
        </ProviderComposer>
      ),
      type: 'collapse',
      noCollapse: true,
    },
    {
      name: 'Data Union Records',
      key: 'union-data',
      icon: <Icon fontSize="medium">group_work</Icon>,
      route: '/union-data',
      component: (
        <ProviderComposer
          contexts={[
            <UnionContextProvider />,
            <OrganizationContextProvider />,
            <UserContextProvider />,
          ]}
        >
          <ViewUnionData />
        </ProviderComposer>
      ),
    },
    {
      name: 'Documentation',
      key: 'Documentation',
      icon: <Icon fontSize="medium">integration_instructions</Icon>,
      route: '/documentation',
      component: <Documentation />,
      type: 'collapse',
      noCollapse: true,
    },
    // {
    //   name: 'JS Blob',
    //   key: 'JSBlob',
    //   icon: <Icon fontSize="medium">integration_instructions</Icon>,
    //   route: '/js-blob',
    //   component: <JsBlob />,
    //   type: 'collapse',
    //   noCollapse: true,
    // },
    { type: 'divider', key: 'divider-2' },
    // { type: 'title', title: 'Docs', key: 'title-docs' },
  ];

  if (isAdmin) {
    routesArray.push({
      name: 'Admin Panel',
      key: 'admin-panel',
      icon: <Icon fontSize="medium">admin_panel_settings</Icon>,
      route: '/admin-panel',
      component: <AdminPanel />,
      type: 'collapse',
      noCollapse: true,
    });
  }

  return routesArray;
};

export default routes;
