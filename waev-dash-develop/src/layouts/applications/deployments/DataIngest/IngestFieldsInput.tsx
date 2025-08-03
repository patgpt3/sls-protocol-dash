import { Icon, IconButton } from '@mui/material';
import { InfoCard, InputWithAction, MDBox, MDTypography } from 'components';
import { DeploymentContext, SelectedEntityContext } from 'contexts';
import { useContext, useState } from 'hooks';
import { defineMessages, useIntl } from 'utils';

export const messages = defineMessages({
  fieldName: {
    id: 'deployments.ingest_fields.field_name',
    defaultMessage: 'Field Name',
  },
  addTooltip: {
    id: 'deployments.ingest_fields.tooltip.add',
    defaultMessage: 'Add',
  },
  setTooltip: {
    id: 'deployments.ingest_fields.tooltip.set',
    defaultMessage: 'Set as User ID field',
  },
  fields: {
    id: 'deployments.ingest_fields.title',
    defaultMessage: 'Fields',
  },
  privateFields: {
    id: 'deployments.ingest.private_fields.title',
    defaultMessage: 'Private Fields',
  },
});

export function IngestFieldsInput(): JSX.Element {
  const intl = useIntl();
  const { ingestFieldsInput, setIngestFieldsInput, ingestUserField, setIngestUserField } =
    useContext(DeploymentContext);
  const [input, setInput] = useState<string>('');
  const { selectedOrganization } = useContext(SelectedEntityContext);

  const onAddClick = () => {
    setIngestFieldsInput([...new Set((ingestFieldsInput || []).concat([input]))] as string[]);
    setInput('');
  };

  const onRemoveClick = (value: string) => {
    setIngestFieldsInput((ingestFieldsInput || []).filter((field) => field !== value));
    if (value === ingestUserField) {
      setIngestUserField(undefined);
    }
  };

  const userInput = (
    <InputWithAction
      sx={{ mt: 2 }}
      label={intl.formatMessage(messages.fieldName)}
      placeholder={intl.formatMessage(messages.fieldName)}
      value={input}
      onChange={setInput}
      onPrimaryClick={onAddClick}
      disablePrimaryWhenEmpty
      primaryIcon="add"
      primaryTooltip={intl.formatMessage(messages.addTooltip)}
    />
  );

  const valuesDisplay = ingestFieldsInput?.length > 0 && (
    <>
      {ingestFieldsInput?.map((field, i) => (
        <MDBox display="flex" alignItems="center" key={`Field-${i}`}>
          <IconButton
            size="small"
            aria-label="close"
            color="error"
            onClick={() => onRemoveClick(field)}
            sx={{ pl: 0 }}
          >
            <Icon fontSize="small">remove_circle_outline</Icon>
          </IconButton>
          <MDTypography variant="caption" color="text">
            {field}
          </MDTypography>
        </MDBox>
      ))}
    </>
  );

  return selectedOrganization ? (
    <InfoCard
      icon="web"
      title={intl.formatMessage(messages.fields)}
      // description={valuesDisplay}
      description={userInput}
      // value={body}
      value={valuesDisplay}
      isLight
      // link="/pages/account/settings"
    />
  ) : (
    <></>
  );
}
