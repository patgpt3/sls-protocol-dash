/* eslint-disable no-empty-pattern */
import { Icon, IconButton } from '@mui/material';
import { FancyCheckbox, InfoCard, InputWithAction, MDBox, MDTypography } from 'components';
import { DeploymentContext, SelectedEntityContext } from 'contexts';
import { useContext, useState } from 'hooks';
import { useIntl } from 'utils';
import { messages } from './IngestFieldsInput';

interface IngestFieldsInputProps {
  isStandalone?: boolean;
  [key: string]: any;
}

export function IngestPrivateFieldsInput({}: IngestFieldsInputProps): JSX.Element {
  const intl = useIntl();
  const {
    ingestPrivateFieldsInput,
    setIngestPrivateFieldsInput,
    ingestUserField,
    setIngestUserField,
  } = useContext(DeploymentContext);
  const [input, setInput] = useState<string>('');
  const { selectedOrganization } = useContext(SelectedEntityContext);

  const onAddClick = () => {
    setIngestPrivateFieldsInput([
      ...new Set((ingestPrivateFieldsInput || []).concat([input])),
    ] as string[]);
    setInput('');
  };

  const onRemoveClick = (value: string) => {
    setIngestPrivateFieldsInput(
      (ingestPrivateFieldsInput || []).filter((field) => field !== value)
    );
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
      primaryTooltip={intl.formatMessage(messages.addTooltip)}
      disablePrimaryWhenEmpty
      primaryIcon="add"
    />
  );

  const onFieldClick = (field: string) => {
    ingestUserField !== field ? setIngestUserField(field) : setIngestUserField(undefined);
  };

  const valuesDisplay = ingestPrivateFieldsInput?.length > 0 && (
    <>
      {ingestPrivateFieldsInput?.map((field, i) => (
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
          <FancyCheckbox
            isSelected={field === ingestUserField}
            onSelect={() => onFieldClick(field)}
            icon="person"
            tooltip={intl.formatMessage(messages.setTooltip)}
            tooltipPlacement="top"
          />
          <MDTypography variant="caption" color="text">
            {field}
          </MDTypography>
        </MDBox>
      ))}
    </>
  );

  return selectedOrganization ? (
    <InfoCard
      icon="lock"
      title={intl.formatMessage(messages.privateFields)}
      // description="(required)"
      description={userInput}
      value={valuesDisplay}
      isLight
      // link="/pages/account/settings"
    />
  ) : (
    <></>
  );
}
