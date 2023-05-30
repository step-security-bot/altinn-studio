export interface PolicyType {
  Rules: PolicyRuleCardType[]
}

export interface PolicyRuleCardType {
  RuleId: number;
  Description: string;
  Subject: string[];
  Actions: string[];
  Resources: PolicyRuleResourceType[];
}

export interface PolicyRuleResourceType {
  type: string;
  id: string;
}

export interface PolicySubjectType {
  SubjectId: string;
  SubjectSource: string;
  SubjectTitle: string;
  SubjectDescription: string;
}


export interface PolicyRuleSendType {
  RuleId: string,
  Description: string,
  Subject: string[],
  Actions: string[],
  Resources: string[]
}
export interface PolicyEditorSendType {
  Rules: PolicyRuleSendType[]
}
