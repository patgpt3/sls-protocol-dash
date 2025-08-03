import { useEffect, useState } from 'react';
import { Grid, Icon, Select, MenuItem, Tooltip } from '@mui/material';
import { MDBox, MDInput, MDButton, FlashingLoader, MDTypography } from 'components';
import {
  InputEvent,
  RecordFormField,
  Deployment,
  CSVRecordType,
  RootStateType,
  OptInFlag,
} from 'types';
import { useDispatch, useSelector } from 'react-redux';
import { setAddSingleData } from 'store';
import { useCreateRecord } from 'hooks';
import { FormattedMessage, crossSiteFadeInKeyframes } from 'utils';

interface SingleRecordFormProps {
  selectedDeployment: Deployment;
  optInFlags: OptInFlag[];
  isFetchingOptInFlags: boolean;
}

interface UnmatchedOptIn {
  value: string;
  flagData: OptInFlag;
}

export function SingleRecordForm({
  selectedDeployment,
  optInFlags,
  isFetchingOptInFlags,
}: SingleRecordFormProps): JSX.Element {
  const dispatch = useDispatch();

  const singleRecord = useSelector((state: RootStateType) => state.records.addSingleData);

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [unmatchedFlags, setUnmatchedFlags] = useState([]);

  useEffect(() => {
    if (unmatchedFlags.length === 0 && singleRecord && optInFlags?.length > 0) {
      const unmatchedOptIns: UnmatchedOptIn[] = [];
      optInFlags.forEach((flag: OptInFlag) => {
        const flagInForm = singleRecord.some(
          (item) => item.field === flag?.attributes?.field_selector
        );
        if (!flagInForm) unmatchedOptIns.push({ value: 'Default', flagData: flag });
      });
      setUnmatchedFlags(unmatchedOptIns);
    }
  }, [optInFlags, singleRecord]);

  const payloadData: CSVRecordType = {};

  const { isLoading: isLoadingCreateRecord, mutate: createRecord } = useCreateRecord(
    selectedDeployment?.id,
    payloadData
  );

  let userField: string = selectedDeployment?.attributes?.config?.user_field;
  let configFields: string[] = [];
  let configPrivateFields: string[] = [];

  if (selectedDeployment) {
    configFields = selectedDeployment?.attributes?.config?.fields
      ? selectedDeployment?.attributes?.config?.fields.map((e: { name: string }) => e.name)
      : [];
    configPrivateFields = selectedDeployment?.attributes?.config?.private_fields
      ? selectedDeployment?.attributes?.config?.private_fields.map((e: { name: string }) => e.name)
      : [];
  }

  useEffect(() => {
    if (selectedDeployment) {
      setUnmatchedFlags([]);
      const formFields = [...configPrivateFields, ...configFields];
      const fieldsValues = formFields.map((item: string) => {
        return {
          field: item,
          value: '',
        };
      });
      dispatch(setAddSingleData(fieldsValues));
    }
  }, [selectedDeployment]);

  // Reset data and consent fields after creating a record
  useEffect(() => {
    if (singleRecord === undefined && selectedDeployment) {
      setUnmatchedFlags([]);
      const formFields = [...configPrivateFields, ...configFields];
      const fieldsValues = formFields.map((item: string) => {
        return {
          field: item,
          value: '',
        };
      });
      dispatch(setAddSingleData(fieldsValues));
    }
  }, [singleRecord]);

  const handleFieldChange = (value: string, field: string) => {
    const formData = singleRecord.map((item: RecordFormField) => {
      if (item.field === field) {
        if (field === userField && value && !isSubmitEnabled) setIsSubmitEnabled(true);
        if (field === userField && !value && isSubmitEnabled) setIsSubmitEnabled(false);
        return {
          field: item.field,
          value: value,
        };
      } else {
        return item;
      }
    });
    dispatch(setAddSingleData(formData));
  };

  const handleSelectChange = (selectedFlag: UnmatchedOptIn, event: any) => {
    const newValues = unmatchedFlags.map((flag: UnmatchedOptIn) => {
      if (
        selectedFlag.flagData?.attributes?.field_selector ===
        flag.flagData?.attributes?.field_selector
      ) {
        return {
          value: event.target.value,
          flagData: selectedFlag.flagData,
        };
      } else {
        return flag;
      }
    });
    setUnmatchedFlags(newValues);
  };

  const onSubmitRecord = () => {
    singleRecord.forEach((item: RecordFormField) => {
      payloadData[item.field] = item.value;
    });
    unmatchedFlags.forEach((flag: UnmatchedOptIn) => {
      if (flag.value === 'True') payloadData[flag.flagData.attributes.field_selector] = '1';
      if (flag.value === 'False') payloadData[flag.flagData.attributes.field_selector] = '';
    });
    createRecord();
  };

  return (
    <Grid container alignItems="center" justifyContent="center" spacing={0}>
      <Grid
        item
        xs={12}
        pt={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
      >
        <MDTypography variant="h6">
          <FormattedMessage id="create_records.fields.title" defaultMessage="Data Fields" />
        </MDTypography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
      >
        <MDBox pt={1} pb={3} px={3}>
          {singleRecord ? (
            <MDBox component="form" role="form" autoComplete="off">
              {singleRecord.map((formFiled: RecordFormField) => (
                <MDBox key={formFiled.field} mb={2} sx={{ position: 'relative' }}>
                  <MDInput
                    inputProps={{
                      data: `add-record-${formFiled.field}`,
                      autoComplete: 'off',
                    }}
                    type="text"
                    label={formFiled.field}
                    variant="standard"
                    fullWidth
                    value={formFiled.value}
                    onChange={(e: InputEvent) => handleFieldChange(e.target.value, formFiled.field)}
                  />
                  {formFiled.field === userField && (
                    <MDBox
                      sx={{
                        opacity: 0.8,
                        position: 'absolute',
                        top: '1rem',
                        right: '1.5rem',
                      }}
                    >
                      <MDTypography variant="h6" color="error">
                        *
                      </MDTypography>
                    </MDBox>
                  )}
                  <Tooltip
                    title={
                      configPrivateFields.includes(formFiled.field) ? (
                        formFiled.field === userField ? (
                          <FormattedMessage
                            id="create_records.tooltip.private_user_field"
                            defaultMessage="User Field (Private)"
                          />
                        ) : (
                          <FormattedMessage
                            id="create_records.tooltip.private_field"
                            defaultMessage="Private Field"
                          />
                        )
                      ) : formFiled.field === userField ? (
                        <FormattedMessage
                          id="create_records.tooltip.public_user_field"
                          defaultMessage="User Field (Public)"
                        />
                      ) : (
                        <FormattedMessage
                          id="create_records.tooltip.public_field"
                          defaultMessage="Public Field"
                        />
                      )
                    }
                    placement="right"
                  >
                    <Icon
                      fontSize="small"
                      color={configPrivateFields.includes(formFiled.field) ? 'success' : 'info'}
                      sx={{
                        opacity: 0.8,
                        position: 'absolute',
                        top: '1rem',
                        right: '0',
                      }}
                    >
                      {configPrivateFields.includes(formFiled.field) ? 'lock' : 'lock_open'}
                    </Icon>
                  </Tooltip>
                </MDBox>
              ))}
              <Grid
                item
                xs={12}
                pt={3}
                pb={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <MDTypography variant="h6">
                  <FormattedMessage
                    id="create_records.consent.title"
                    defaultMessage="Consent Fields"
                  />
                </MDTypography>
              </Grid>

              {isFetchingOptInFlags ? (
                <MDBox sx={{ width: '100%' }} data-testid="register-loading-status">
                  <FlashingLoader />
                </MDBox>
              ) : optInFlags?.length > 0 &&
                optInFlags.some((f: OptInFlag) => f?.attributes?.active) ? (
                optInFlags.map((flag: OptInFlag) => {
                  const formFlag = singleRecord.find(
                    (item) => item.field === flag?.attributes?.field_selector
                  );
                  const unmatchedFlag = unmatchedFlags.find(
                    (item) =>
                      item.flagData?.attributes?.field_selector === flag?.attributes?.field_selector
                  );

                  return flag?.attributes?.active ? (
                    <Grid container key={flag.id} pt={1} display="flex" alignItems="center">
                      <Grid item xs={10}>
                        <MDTypography variant="button" color="white" fontWeight="regular">
                          {`${flag?.attributes?.field_selector} `}
                        </MDTypography>
                        <MDTypography variant="button" color="text" fontWeight="light">
                          {`(${
                            flag?.attributes?.name.length > 40
                              ? flag?.attributes?.name.slice(0, 38) + '...'
                              : flag?.attributes?.name
                          })`}
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2} display="flex" justifyContent="flex-end">
                        {formFlag ? (
                          formFlag.value.length > 0 ? (
                            <Icon fontSize="small" color="success" sx={{ opacity: 0.8 }}>
                              check
                            </Icon>
                          ) : (
                            <Icon fontSize="small" color="error" sx={{ opacity: 0.8 }}>
                              close
                            </Icon>
                          )
                        ) : (
                          <Select
                            size="medium"
                            sx={{
                              width: '3.6rem',
                              height: '2rem',
                              color: 'white',
                              textAlign: 'center',
                            }}
                            id={`select-${flag.id}`}
                            value={unmatchedFlag ? unmatchedFlag.value : 'Default'}
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={(event: any) => handleSelectChange(unmatchedFlag, event)}
                          >
                            <MenuItem sx={{ width: '8rem' }} value={'Default'}>
                              ——
                            </MenuItem>
                            <MenuItem sx={{ width: '8rem' }} value={'True'}>
                              <FormattedMessage
                                id="create_records.select.true"
                                defaultMessage="True"
                              />
                            </MenuItem>
                            <MenuItem sx={{ width: '8rem' }} value={'False'}>
                              <FormattedMessage
                                id="create_records.select.false"
                                defaultMessage="False"
                              />
                            </MenuItem>
                          </Select>
                        )}
                      </Grid>
                    </Grid>
                  ) : null;
                })
              ) : (
                <MDBox display="flex" alignItems="center" justifyContent="center">
                  <MDTypography
                    variant="button"
                    fontWeight="light"
                    color="text"
                    justifyContent="center"
                  >
                    {optInFlags?.length > 0 ? (
                      <FormattedMessage
                        id="create_records.placeholder.no_active"
                        defaultMessage="No Active Opt-Ins"
                      />
                    ) : (
                      <FormattedMessage
                        id="create_records.placeholder.no_flags"
                        defaultMessage="No Opt-Ins Configured"
                      />
                    )}
                  </MDTypography>
                </MDBox>
              )}
              <MDBox mt={5} mb={1}>
                <MDButton
                  type="button"
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={!isSubmitEnabled || isLoadingCreateRecord}
                  onClick={onSubmitRecord}
                >
                  {isLoadingCreateRecord ? (
                    <MDBox sx={{ width: '100%' }} data-testid="register-loading-status">
                      <FlashingLoader />
                    </MDBox>
                  ) : (
                    <FormattedMessage id="create_records.button.submit" defaultMessage="Submit" />
                  )}
                </MDButton>
              </MDBox>
            </MDBox>
          ) : (
            <MDBox sx={{ width: '100%' }} data-testid="register-loading-status">
              <FlashingLoader />
            </MDBox>
          )}
        </MDBox>
      </Grid>
    </Grid>
  );
}
