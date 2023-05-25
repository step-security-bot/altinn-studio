import { PolicyRuleCardType, PolicyRuleResourceType, PolicyType } from "resourceadm/types/global";

// RESOURCE ID
export const resourceId1: string = "test_id_1"
export const resourceId2: string = "test_id_2"
export const resourceId3: string = "test_id_3"

// RESOURCES
const resourceMock1: PolicyRuleResourceType = {
  type: 'test',
  id: resourceId1
}
const resourceMock2: PolicyRuleResourceType = {
  type: 'Test Test',
  id: resourceId2
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
