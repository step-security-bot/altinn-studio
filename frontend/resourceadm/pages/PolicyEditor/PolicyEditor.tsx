import React, { useState } from 'react';
import classes from './PolicyEditor.module.css';
import { ExternalLinkIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { ExpandablePolicyCard } from 'resourceadm/components/ExpandablePolicyCard';
import { CardButton } from 'resourceadm/components/CardButton';
import { Select, TextField, Button } from '@digdir/design-system-react';
import { PolicyRuleCardType } from 'resourceadm/types/global';

/**
 * Displays the content where a user can add and edit a policy
 */
export const PolicyEditor = () => {
  // TODO - translation
  const [policyName, setPolicyName] = useState('');
  const [policyId, setPolicyId] = useState('altinnapp.ORGNAME.');
  const [policyRules, setPolicyRules] = useState<PolicyRuleCardType[]>([]);

  // Initial rule with empty values
  const initialRule: PolicyRuleCardType = {
    levelsInResource: [],
    rightsToGive: [],
    policiesGiveTo: [],
    decisionText: '',
  };

  // Displays all the rule cards
  const displayRules = policyRules.map((pr, i) => (
    <div className={classes.space} key={i}>
      <ExpandablePolicyCard />
    </div>
  ));

  // Checks the policy name for errors and returns the string formatted correctly
  const mapPolicyNameToPolicyId = (text: string): string => {
    // TODO - handle illegal characters

    return text.replaceAll(' ', '-');
  };

  const handleAddCardClick = () => {
    setPolicyRules((v) => [...v, ...[initialRule]]);

    // Make sure the already open card is closed
  };

  return (
    <div className={classes.policyEditorWrapper}>
      <div className={classes.policyEditorContainer}>
        <div className={classes.policyEditorTop}>
          <h2 className={classes.policyEditorHeader}>Policy editor</h2>
          <p className={classes.subHeader}>Navn på policyen</p>
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
            {policyName.length > 0 ? (
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
            )}
          </div>
          <p className={classes.subHeader}>Velg ressurs</p>
          <p>
            Om du har ingen ressurs kan du{' '}
            <a
              className={classes.externalLink}
              href=''
              onClick={() => alert('Todo - Add correct url.')}
            >
              lage en ny ressurs {/* TODO - Add Icon */}
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
          </div>
        </div>
        {displayRules}
        <div className={classes.space}>
          <CardButton buttonText='Legg til ekstra regelsett' onClick={handleAddCardClick} />
        </div>
      </div>
    </div>
  );
};
