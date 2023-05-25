import { PolicyRuleCardType, PolicyRuleResourceType, PolicyType } from "resourceadm/types/global";

// RESOURCE ID
export const resourceIdMock1: string = "test_id_1"
export const resourceIdMock2: string = "test_id_2"
export const resourceIdMock3: string = "test_id_3"

// RESOURCE TYPE
export const resourceTypeMock1: string = "urn:altinn:resource1"
export const resourceTypeMock2: string = "urn:altinn:resource2"
export const resourceTypeMock3: string = "urn:altinn:resource3"

// RESOURCES
const resourceMock1: PolicyRuleResourceType = {
  type: resourceTypeMock1,
  id: resourceIdMock1
}
const resourceMock2: PolicyRuleResourceType = {
  type: resourceTypeMock2,
  id: resourceIdMock2
}

// RULES
const ruleMock1: PolicyRuleCardType = {
  RuleId: 1,
  Resources: [resourceMock1, resourceMock2],
  Actions: ['Read', 'Write'],
  Subject: ['Styreleder', 'Styremedlem'],
  Description: 'Dette er en forklaring på hva regelen er.'
}

// POLICIES
export const policyMock1: PolicyType = {
  Rules: [ruleMock1]
};

export const policyMock2: PolicyType = {
  Rules: []
};
