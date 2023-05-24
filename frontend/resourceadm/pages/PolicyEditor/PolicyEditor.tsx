import React, { useState } from 'react';
import classes from './PolicyEditor.module.css';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { ExpandablePolicyCard } from 'resourceadm/components/ExpandablePolicyCard';
import { CardButton } from 'resourceadm/components/CardButton';
import { Select } from '@digdir/design-system-react';

/**
 * Displays the content where a user can add and edit a policy
 */
export const PolicyEditor = () => {
  // TODO - translation

  const [policyRules, setPolicyRules] = useState([]); // TODO - Add the Type that is created on the cards

  const displayRules = policyRules.map((pr, i) => (
    <div className={classes.space} key={i}>
      <ExpandablePolicyCard />
    </div>
  ));

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
          {/* TODO - Make separate component for the search box and the thing below it */}
          <p
            style={{
              marginTop: '20px',
              border: 'solid 2px #0062BA',
              paddingInline: '5px',
              paddingBlock: '3px',
              borderRadius: '3px',
            }}
          >
            TODO - altinnapp.svv....{' '}
          </p>
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
          <div className={classes.selectWrapper}>
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
          <CardButton
            buttonText='Legg til ekstra regelsett'
            onClick={() => {
              setPolicyRules((v) => [...v, ...[{ v: 1 }]]);

              // Make sure the already open card is closed
            }}
          />
        </div>
      </div>
    </div>
  );
};
