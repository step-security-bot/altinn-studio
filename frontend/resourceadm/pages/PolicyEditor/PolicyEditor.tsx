import React, { useEffect, useState } from 'react';
import classes from './PolicyEditor.module.css';
import { ExpandablePolicyCard } from 'resourceadm/components/ExpandablePolicyCard';
import { CardButton } from 'resourceadm/components/CardButton';
import { Button } from '@digdir/design-system-react';
import {
  PolicyEditorSendType,
  PolicyRuleCardType,
  PolicyRuleSendType,
  PolicySubjectType,
} from 'resourceadm/types/global';
import { useLocation } from 'react-router-dom';
import {
  actionsListMock,
  policyMock1,
  policyMock2,
  subjectsListMock,
} from 'resourceadm/data-mocks/policies';

/**
 * Empty rule when new card added
 */
const emptyPolicyRule: PolicyRuleCardType = {
  RuleId: 0,
  Resources: [],
  Actions: [],
  Subject: [],
  Description: '',
};

/**
 * Displays the content where a user can add and edit a policy
 */
export const PolicyEditor = () => {
  // TODO - translation
  // TODO - Make this component able to manage and control the values inside the cards

  const { state } = useLocation();

  // Set the resurceId sent in params or set it to null. If null, display error (TODO)
  const resourceId = state === null ? null : state.resourceId;
  const resourceType = state === null ? null : state.resourceType;

  // TODO - replace with list from backend
  const [actions, setActions] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<PolicySubjectType[]>([]);

  // TODO - Make it possible to update values inside the rules tooo
  const [policyRules, setPolicyRules] = useState<PolicyRuleCardType[]>([]);

  // TODO - implement useOnce hook to get the policy
  useEffect(() => {
    // TODO - API Call to get the correct actions, AND TRANSLATE THEM
    setActions(actionsListMock);
    // TODO - API Call to get the correct subjects
    setSubjects(subjectsListMock);

    // TODO - API Call to get policy by the resource ID
    // TODO - Find out what the object sent from backend looks like
    setPolicyRules(resourceId === 'test_id_1' ? policyMock1.Rules : policyMock2.Rules);
  }, [resourceId]);

  // Displays all the rule cards
  const displayRules = policyRules.map((pr, i) => (
    <div className={classes.space} key={i}>
      <ExpandablePolicyCard
        policyRule={pr}
        actions={actions}
        subjects={subjects}
        rules={policyRules}
        setPolicyRules={setPolicyRules}
        rulePosition={i}
      />
    </div>
  ));

  /**
   * Handles adding of more cards
   */
  const handleAddCardClick = () => {
    setPolicyRules((prevRules) => [
      ...prevRules,
      ...[
        {
          ...emptyPolicyRule,
          RuleId: policyRules.length + 1,
          Resources: [{ type: resourceType, id: resourceId }],
        },
      ],
    ]);

    // Make sure the already open card is closed
  };

  const mapSubjectTitleToSubjectString = (subjectTitle: string): string => {
    const subject: PolicySubjectType = subjects.find((s) => s.SubjectTitle === subjectTitle);
    return `urn:${subject.SubjectSource}:${subject.SubjectId}`;
  };

  const mapPolicyRuleObjectToPolicyRuleObject = (pr: PolicyRuleCardType): PolicyRuleSendType => {
    const resources: string[] = pr.Resources.map((r) => `${r.type}:${r.id}`);

    const subject: string[] = pr.Subject.map((s) => mapSubjectTitleToSubjectString(s));

    return {
      RuleId: `${resourceType}:${resourceId}:ruleid:${pr.RuleId}`,
      Description: pr.Description,
      Subject: subject,
      Actions: pr.Actions,
      Resources: resources,
    };
  };

  const handleSavePolicy = () => {
    const policyEditorRules: PolicyRuleSendType[] = policyRules.map((pr) =>
      mapPolicyRuleObjectToPolicyRuleObject(pr)
    );

    const resourceWithRules: PolicyEditorSendType = {
      Rules: policyEditorRules,
    };

    console.log('Object to be sent: ', resourceWithRules);
    console.log('Object to be sent as JSON object: \n', JSON.stringify(resourceWithRules, null, 2));
  };

  return (
    // TODO - display spinner when loading
    // TODO - display error if resourceId === null
    <div className={classes.policyEditorWrapper}>
      <div className={classes.policyEditorContainer}>
        <div className={classes.policyEditorTop}>
          <h2 className={classes.policyEditorHeader}>Policy editor</h2>
          {/*<p className={classes.subHeader}>Navn på policyen</p>*/}
          <p>
            Endrer regler for policy med navn: <strong>{resourceId}</strong>
          </p>
          {/* TODO - Delete this?
          <p>
            Navnet bør være beskrivende for hva policyen handler om slik at andre enkelt kan forstå
            og gjenbruke policyen. Pass på at navnet er forståelig og gjenkjennbart. Om mulig, bruk
            nøkkelord som man kan søke etter.
          </p>
          <div className={classes.componentWrapper}>
            <TextField
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder='Navn på policyen'
            />
            policyName.length > 0 ? (
              <div className={classes.textFieldIdWrapper}>
                <div className={classes.idBox}>
                  <p className={classes.idBoxText}>id</p>
                </div>
                <p className={classes.idText}>
                  {policyId.split('.')[0]}.{policyId.split('.')[1]}.
                  <strong>{mapPolicyNameToPolicyId(policyName)}</strong>
                </p>
                <Button
                  icon={<PencilWritingIcon title='a11y-title' fontSize='1.5rem' />}
                  variant='quiet'
                  onClick={() => {
                    alert('todo');
                    // TODO - make it possible to edit the id to something else than the policy name
                    setPolicyId(policyId);
                  }}
                />
              </div>
            ) : (
              <div className={classes.emptyPolicyName} />
            )
          </div>
          <p className={classes.subHeader}>Velg ressurs</p>
          <p>
            Om du har ingen ressurs kan du{' '}
            <a
              className={classes.externalLink}
              href=''
              onClick={() => alert('Todo - Add correct url.')}
            >
              lage en ny ressurs
              <ExternalLinkIcon title='a11y-title' fontSize='1.4rem' />
            </a>{' '}
            og kobble den til i denne policyeditoren senere eller fra ressureditoren som en del av
            policynivået.
          </p>
          <div className={classes.componentWrapper}>
            <Select
              options={[
                { value: 'Ressurs 1', label: 'Ressurs 1' },
                { value: 'Ressurs 2', label: 'Ressurs 2' },
                { value: 'Ressurs 3', label: 'Ressurs 3' },
              ]}
            />
          </div>*/}
        </div>
        <p className={classes.subHeader}>Se eller legg til regler for policyen</p>
        {displayRules}
        {/*<ExpandablePolicyCard
          policyRule={{
            ...emptyPolicyRule,
            RuleId: policyRules.length + 1,
            Resources: [{ type: resourceType, id: resourceId }],
          }}
        />*/}
        <div className={classes.space}>
          <CardButton buttonText='Legg til ekstra regelsett' onClick={handleAddCardClick} />
        </div>
        <Button
          type='button'
          onClick={() => {
            handleSavePolicy();
            // alert('todo - save');
          }}
        >
          Lagre policyen
        </Button>
      </div>
    </div>
  );
};