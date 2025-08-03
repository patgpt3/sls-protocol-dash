import { DeploymentPayload } from 'types';

export const deploymentPayload: DeploymentPayload = {
  data: {
    type: 'deployments',
    attributes: {
      organization_id: 'TEMP',
      name: 'Test Deployment',
      config: {
        user_field: 'email',
        fields: [
          { name: 'email' },
          { name: 'phone_number' },
          { name: 'first_name' },
          { name: 'last_name' },
        ],
        private_fields: [{ name: 'street_address' }, { name: 'zip_code' }],
      },
    },
  },
};

export const deploymentSuccess: DeploymentPayload = {
  data: {
    type: 'deployments',
    relationships: {
      accesses: {
        links: {
          self: '/deployments/b4a0f361-ad8e-43d3-aead-6102f0d0a41b/relationships/accesses',
          related: '/accesses?id=b4a0f361-ad8e-43d3-aead-6102f0d0a41b',
        },
      },
      organization: {
        links: {
          self: '/deployments/b4a0f361-ad8e-43d3-aead-6102f0d0a41b/relationships/organizations',
          related: '/organizations/b4a0f361-ad8e-43d3-aead-6102f0d0a41b',
        },
      },
      permissions: {
        links: {
          self: '/deployments/b4a0f361-ad8e-43d3-aead-6102f0d0a41b/relationships/permissions',
          related: '/permissions?id=b4a0f361-ad8e-43d3-aead-6102f0d0a41b',
        },
      },
    },
    attributes: {
      name: 'Test Deployment',
      config: {
        fields: [
          {
            name: 'email',
            required: false,
            opt_in: null,
          },
          {
            name: 'phone_number',
            required: false,
            opt_in: null,
          },
          {
            name: 'first_name',
            required: false,
            opt_in: null,
          },
          {
            name: 'last_name',
            required: false,
            opt_in: null,
          },
        ],
        private_fields: [
          {
            name: 'street_address',
            required: false,
            opt_in: null,
          },
          {
            name: 'zip_code',
            required: false,
            opt_in: null,
          },
        ],
        user_field: 'email',
      },
    },
    id: 'b4a0f361-ad8e-43d3-aead-6102f0d0a41b',
    links: {
      self: '/deployments/b4a0f361-ad8e-43d3-aead-6102f0d0a41b',
    },
  },
  links: {
    self: '/deployments/b4a0f361-ad8e-43d3-aead-6102f0d0a41b',
  },
  jsonapi: {
    version: '1.0',
  },
};
