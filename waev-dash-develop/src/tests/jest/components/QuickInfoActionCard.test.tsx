/* eslint-disable testing-library/prefer-screen-queries */
import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import { Icon } from '@mui/material';
import { QuickInfoActionCard, QuickInfoActionCardProps } from 'components';
import renderWithProviders from 'tests/mock/renderWithProviders';

const renderForm = async (props: QuickInfoActionCardProps) => {
  return renderWithProviders(render, <QuickInfoActionCard {...props} />);
};

const unmockedFetch = global.fetch;
// const mockFetch = jest.spyOn(global, 'fetch');

beforeAll(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve(undefined),
      text: () => Promise.resolve(undefined),
      ok: true,
    } as Response);
});

afterAll(() => {
  global.fetch = unmockedFetch;
});

describe('QuickInfoActionCard', () => {
  it('[QuickInfoActionCard-1] renders appropriately', async () => {
    const props: QuickInfoActionCardProps = {
      name: faker.lorem.sentence(2),
      description: faker.lorem.sentence(5),
      image: <Icon fontSize="medium">person</Icon>,
      subDescription: faker.lorem.sentence(2),
      color: 'info',
    };
    renderForm(props);

    expect(screen.getByTestId('quick-info-name')).toBeDefined();
    expect(screen.getByTestId('quick-info-description')).toBeDefined();
    expect(screen.getByTestId('quick-info-image')).toBeDefined();
    expect(screen.getByTestId('quick-info-sub-description')).toBeDefined();
  });
  it('[QuickInfoActionCard-3] renders required appropriately', async () => {
    const props: QuickInfoActionCardProps = {
      name: faker.lorem.sentence(2),
      image: <Icon fontSize="medium">person</Icon>,
      color: 'info',
    };
    renderForm(props);

    expect(screen.getByTestId('quick-info-name')).toBeDefined();
    expect(screen.queryByTestId('quick-info-description')).not.toBeInTheDocument();
    expect(screen.getByTestId('quick-info-image')).toBeDefined();
    expect(screen.queryByTestId('quick-info-sub-description')).not.toBeInTheDocument();
  });

  it('[QuickInfoActionCard-2] renders appropriately', async () => {
    const props: QuickInfoActionCardProps = {
      name: faker.lorem.sentence(2),
      description: faker.lorem.sentence(5),
      image: <Icon fontSize="medium">person</Icon>,
      subDescription: faker.lorem.sentence(2),
      color: 'info',
    };
    renderForm(props);

    expect(screen.getByTestId('quick-info-name')).toHaveTextContent(props.name);
    expect(screen.getByTestId('quick-info-description')).toHaveTextContent(
      props.description as string
    );
    expect(screen.getByTestId('quick-info-image')).toHaveTextContent('person');
    expect(screen.getByTestId('quick-info-sub-description')).toHaveTextContent(
      props.subDescription as string
    );
  });
});
