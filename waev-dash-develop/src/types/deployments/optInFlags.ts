import { JSONApiSuccess, JSONApiFailure, JSONLinks, JSONApiVersion, Relationships } from '../data';

export interface OptInFlagStripped {
  domain?: string;
  deploymentId?: string;
  domainId?: string;
}
export interface OptInFlag {
  attributes: OptInFlagAttributes;
  type?: 'flags';
  id?: string;
  relationships?: Relationships;
}

interface ResponseOptInFlagPayload extends JSONApiSuccess {
  data: OptInFlag;
  included?: any[];
}

interface ResponseOptInFlagsPayload extends JSONApiSuccess {
  data: OptInFlag[];
  included?: any[];
}

export type ResponseOptInFlag = ResponseOptInFlagPayload | JSONApiFailure;
export type ResponseOptInFlags = ResponseOptInFlagsPayload | JSONApiFailure;

export interface OptInFlagAttributes extends OptInFlagData {
  fingerprint?: string;
  can_delete?: boolean;
}

export interface ComparatorObj {
  value: string;
  label: string;
  tooltip: string;
}

export interface ComparatorValuesPayload {
  [key: string]: ComparatorObj;
}

export const ComparatorValues: ComparatorValuesPayload = {
  yes_no: {
    value: 'yes_no',
    label: 'Yes or No',
    tooltip: `<div><div>Opt-Ins/Outs are strictly true/false-type values.</div>
      <div>• Opt-Ins: Yes, 1, True, Y, T.</div>
      <div>• Opt-outs: 0, false, null.</div></div>`,
  },
  truthy: {
    value: 'truthy',
    label: 'Truthy',
    tooltip: `<div><div>Opt-Ins/Outs check that there is a value and that it is not a false-type value.</div>
      <div>• Opt-ins include: "Henry", "True", etc.</div>
      <div>• Opt-outs: 0, false, null.</div></div>`,
  },
};

export interface OptInFlagData {
  deployment_id?: string;
  name: string;
  field_selector: string;
  comparator?: string;
  active: boolean;
}

export interface OptInFlagPayloadData {
  attributes: OptInFlagData;
  type: 'flags';
  id?: string;
  // relationships?: OptInFlagRelationships;
  links?: JSONLinks;
}

export interface OptInFlagPayload {
  data: OptInFlagPayloadData;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
}
