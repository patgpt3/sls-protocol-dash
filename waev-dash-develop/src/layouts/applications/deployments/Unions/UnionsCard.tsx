import { InfoCard, MDBox } from 'components';
import { DeploymentContext } from 'contexts';
import { useContext } from 'hooks';
import { Unions } from './Unions';
import { defineMessages, useIntl } from 'utils';

const messages = defineMessages({
  title: {
    id: 'deployments.unions_card.title',
    defaultMessage: 'Data Unions',
  },
});

export function UnionsCard(): JSX.Element {
  const intl = useIntl();
  const { setIsAssociatingUnion, isHasOwnerOrAdminAccess } = useContext(DeploymentContext);

  const body = (
    <MDBox alignItems="center">
      <Unions />
    </MDBox>
  );

  const onClickAdd = () => {
    setIsAssociatingUnion(true);
  };

  return isHasOwnerOrAdminAccess ? (
    <InfoCard
      title={intl.formatMessage(messages.title)}
      icon="group_work"
      value={body}
      menuIconRightFontWeight={800}
      menuIconRight="add"
      onClickRight={onClickAdd}
      id="unionsCard"
    />
  ) : (
    <InfoCard
      title={intl.formatMessage(messages.title)}
      icon="group_work"
      value={body}
      menuIconRightFontWeight={800}
    />
  );
}
