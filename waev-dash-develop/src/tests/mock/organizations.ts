import { ResponseOrganization, ResponseOrganizations } from 'types';

export const mockOrganizationsResponse: ResponseOrganizations = {
  data: [

    {
      type: 'organizations',
      relationships: {
        domains: {
          links: {
            self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/relationships/domains',
            related: '/domains?id=b7df77fe-3273-49a2-bb27-3f32bf0666a2',
          },
          data: [
            {
              type: 'domains',
              id: '539216f5-0593-48a4-af9b-b28fa42df0bd',
            },
          ],
        },
        permissions: {
          links: {
            related: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions',
          },
          data: [
            {
              type: 'permissions',
              id: 'cb14eb56-fc3a-4524-854e-db475b9ccf61',
            },
            {
              type: 'permissions',
              id: '9d39a5c4-134f-40be-9ae3-d973969f5fff',
            },
            {
              type: 'permissions',
              id: '34411c0b-468f-44e2-8825-92f3cab49e0c',
            },
          ],
        },
        deployments: {
          links: {
            self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/relationships/deployments',
            related: '/deployments?id=b7df77fe-3273-49a2-bb27-3f32bf0666a2',
          },
          data: [
            {
              type: 'deployments',
              id: 'f2ab970a-b76c-4e73-abb1-60329a5cc63c',
            },
          ],
        },
      },
      id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
      attributes: {
        name: 'Mock Organization',
        fingerprint: '',
      },
      links: {
        self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2',
      },
    },

  ],
  links: {
    self: 'http://api-staging.waevdata.com/organizations?include=deployments.domains%2Cpermissions%2Cdomains',
  },
  included: [
    {
      type: 'deployment_domains',
      attributes: {
        config: {
          opt_in_form_selector: '',
          opt_out_form_selector: '',
        },
        fingerprint: '',
      },
      relationships: {
        domain: {
          links: {
            self: '/deployments/9637e966-3905-4ce5-a5fd-d5533eb16b32/relationships/domains',
            related: '/domains?id=9637e966-3905-4ce5-a5fd-d5533eb16b32',
          },
        },
        deployment: {
          links: {
            self: '/deployments/9637e966-3905-4ce5-a5fd-d5533eb16b32/relationships/domains',
            related: '/deployments?id=9637e966-3905-4ce5-a5fd-d5533eb16b32',
          },
        },
      },
      id: '9637e966-3905-4ce5-a5fd-d5533eb16b32',
      links: {
        self: '/deployment_domains/9637e966-3905-4ce5-a5fd-d5533eb16b32',
      },
    },
    {
      type: 'domains',
      attributes: {
        verification_code: 'f31b9a67-1f00-4dbf-aade-faa9f40bf7b6',
        domain: 'mockDomain.com',
        domain_verified_at: null,
        dns_verified_at: null,
        fingerprint: '',
      },
      relationships: {
        organization: {
          links: {
            self: '/domains/539216f5-0593-48a4-af9b-b28fa42df0bd/relationships/organizations',
            related: '/domains/539216f5-0593-48a4-af9b-b28fa42df0bd',
          },
        },
        permissions: {
          links: {
            related: '/domains/539216f5-0593-48a4-af9b-b28fa42df0bd/permissions',
          },
        },
        deployments: {
          links: {
            self: '/deployments/539216f5-0593-48a4-af9b-b28fa42df0bd/relationships/domains',
          },
        },
      },
      id: '539216f5-0593-48a4-af9b-b28fa42df0bd',
      links: {
        self: '/domains/539216f5-0593-48a4-af9b-b28fa42df0bd',
      },
    },
    {
      type: 'permissions',
      attributes: {
        pending: false,
        organization_id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        user_id: 'mike@waevdata.com',
        permissions: {
          owner: true,
          admin: false,
          read: false,
          write: false,
          delete: false,
        },
        fingerprint: '',
      },
      id: 'cb14eb56-fc3a-4524-854e-db475b9ccf61',
      links: {
        self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions/cb14eb56-fc3a-4524-854e-db475b9ccf61',
      },
    },
    {
      type: 'permissions',
      attributes: {
        pending: false,
        organization_id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        user_id: 'mike+read@waevdata.com',
        permissions: {
          owner: false,
          admin: false,
          read: false,
          write: true,
          delete: false,
        },
        fingerprint: '',
      },
      id: '9d39a5c4-134f-40be-9ae3-d973969f5fff',
      links: {
        self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions/9d39a5c4-134f-40be-9ae3-d973969f5fff',
      },
    },
    {
      type: 'permissions',
      attributes: {
        pending: false,
        organization_id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        user_id: 'mike+owner@waevdata.com',
        permissions: {
          owner: false,
          admin: false,
          read: false,
          write: false,
          delete: false,
        },
        fingerprint: '',
      },
      id: '34411c0b-468f-44e2-8825-92f3cab49e0c',
      links: {
        self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions/34411c0b-468f-44e2-8825-92f3cab49e0c',
      },
    },
    {
      type: 'deployments',
      attributes: {
        config: {
          fields: [
            {
              name: 'f1',
              required: false,
              opt_in: null,
            },
          ],
          private_fields: [
            {
              name: 'p1',
              required: false,
              opt_in: null,
            },
          ],
          user_field: 'p1',
        },
        name: 'Mock Deployment',
        fingerprint: '',
      },
      relationships: {
        domains: {
          links: {
            self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/relationships/domains',
            related: '/deployment_domains?id=f2ab970a-b76c-4e73-abb1-60329a5cc63c',
          },
          data: [
            {
              type: 'deployment_domains',
              id: '9e551e97-4cbd-44fa-a6f5-885f3065c17a',
            },
          ],
        },
        organization: {
          links: {
            self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/relationships/organizations',
            related: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c',
          },
        },
        accesses: {
          links: {
            self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/relationships/accesses',
            related: '/accesses?id=f2ab970a-b76c-4e73-abb1-60329a5cc63c',
          },
        },
        permissions: {
          links: {
            related: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/permissions',
          },
        },
      },
      id: 'f2ab970a-b76c-4e73-abb1-60329a5cc63c',
      links: {
        self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c',
      },
    },
    {
      type: 'deployment_domains',
      attributes: {
        config: {
          opt_in_form_selector: '',
          opt_out_form_selector: '',
        },
        fingerprint: '',
      },
      relationships: {
        domain: {
          links: {
            self: '/deployments/9e551e97-4cbd-44fa-a6f5-885f3065c17a/relationships/domains',
            related: '/domains?id=9e551e97-4cbd-44fa-a6f5-885f3065c17a',
          },
        },
        deployment: {
          links: {
            self: '/deployments/9e551e97-4cbd-44fa-a6f5-885f3065c17a/relationships/domains',
            related: '/deployments?id=9e551e97-4cbd-44fa-a6f5-885f3065c17a',
          },
        },
      },
      id: '9e551e97-4cbd-44fa-a6f5-885f3065c17a',
      links: {
        self: '/deployment_domains/9e551e97-4cbd-44fa-a6f5-885f3065c17a',
      },
    },

  ],
  meta: {
    count: 3,
  },
  fingerprint: '75ba4bc9b9257f2eb2b82ce2c9df511cb3de9f53',
  jsonapi: {
    version: '1.0',
  },
};

export const mockOrganizationResponse: ResponseOrganization = {
  data: {
    type: 'organizations',
    relationships: {
      domains: {
        links: {
          self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/relationships/domains',
          related: '/domains?id=b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        },
        data: [
          {
            type: 'domains',
            id: '539216f5-0593-48a4-af9b-b28fa42df0bd',
          },
        ],
      },
      permissions: {
        links: {
          related: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions',
        },
        data: [
          {
            type: 'permissions',
            id: 'cb14eb56-fc3a-4524-854e-db475b9ccf61',
          },
          {
            type: 'permissions',
            id: '9d39a5c4-134f-40be-9ae3-d973969f5fff',
          },
          {
            type: 'permissions',
            id: '34411c0b-468f-44e2-8825-92f3cab49e0c',
          },
        ],
      },
      deployments: {
        links: {
          self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/relationships/deployments',
          related: '/deployments?id=b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        },
      },
    },
    id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
    attributes: {
      name: 'Mock Organization',
      fingerprint: '',
    },
    links: {
      self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2',
    },
  },
  links: {
    self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2',
  },
  included: [
    {
      type: 'domains',
      attributes: {
        verification_code: 'f31b9a67-1f00-4dbf-aade-faa9f40bf7b6',
        domain: 'mockDomain.com',
        domain_verified_at: null,
        dns_verified_at: null,
        fingerprint: '',
      },
      relationships: {
        organization: {
          links: {
            self: '/domains/539216f5-0593-48a4-af9b-b28fa42df0bd/relationships/organizations',
            related: '/domains/539216f5-0593-48a4-af9b-b28fa42df0bd',
          },
        },
        permissions: {
          links: {
            related: '/domains/539216f5-0593-48a4-af9b-b28fa42df0bd/permissions',
          },
        },
        deployments: {
          links: {
            self: '/deployments/539216f5-0593-48a4-af9b-b28fa42df0bd/relationships/domains',
          },
        },
      },
      id: '539216f5-0593-48a4-af9b-b28fa42df0bd',
      links: {
        self: '/domains/539216f5-0593-48a4-af9b-b28fa42df0bd',
      },
    },
    {
      type: 'permissions',
      attributes: {
        pending: false,
        organization_id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        user_id: 'mike@waevdata.com',
        permissions: {
          owner: true,
          admin: false,
          read: false,
          write: false,
          delete: false,
        },
        fingerprint: '',
      },
      id: 'cb14eb56-fc3a-4524-854e-db475b9ccf61',
      links: {
        self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions/cb14eb56-fc3a-4524-854e-db475b9ccf61',
      },
    },
    {
      type: 'permissions',
      attributes: {
        pending: false,
        organization_id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        user_id: 'mike+read@waevdata.com',
        permissions: {
          owner: false,
          admin: false,
          read: false,
          write: true,
          delete: false,
        },
        fingerprint: '',
      },
      id: '9d39a5c4-134f-40be-9ae3-d973969f5fff',
      links: {
        self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions/9d39a5c4-134f-40be-9ae3-d973969f5fff',
      },
    },
    {
      type: 'permissions',
      attributes: {
        pending: false,
        organization_id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        user_id: 'mike+owner@waevdata.com',
        permissions: {
          owner: false,
          admin: false,
          read: false,
          write: false,
          delete: false,
        },
        fingerprint: '',
      },
      id: '34411c0b-468f-44e2-8825-92f3cab49e0c',
      links: {
        self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions/34411c0b-468f-44e2-8825-92f3cab49e0c',
      },
    },
  ],
  fingerprint: '75ba4bc9b9257f2eb2b82ce2c9df511cb3de9f53',
  jsonapi: {
    version: '1.0',
  },
};

// import { ResponseOrganization, ResponseOrganizations } from 'types';

// export const mockOrganizationsResponse: ResponseOrganizations = {

// };

// export const mockOrganizationResponse: ResponseOrganization = {

// };
