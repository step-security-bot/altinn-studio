import React from 'react';
import classes from './PolicyEditor.module.css';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { ExpandableCard } from 'resourceadm/components/ExpandableCard';

export const PolicyEditor = () => {
  // TODO - translation

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
          <p
            style={{
              marginTop: '20px',
              border: 'solid 2px #0062BA',
              paddingInline: '5px',
              paddingBlock: '3px',
              borderRadius: '3px',
            }}
          >
            TODO - drop down
          </p>
        </div>
        <div className={classes.ruleCardsWrapper}>
          <ExpandableCard cardTitle='Lese, skrive, arkivere'>
            <p className={classes.subHeader}>Hvilket nivå i ressursen skal reglene gjelde?</p>
            <p
              style={{
                marginTop: '20px',
                border: 'solid 2px #0062BA',
                paddingInline: '5px',
                paddingBlock: '3px',
                borderRadius: '3px',
              }}
            >
              TODO - drop down
            </p>
            <p className={classes.subHeader}>Hvilke rettigheter skal gis?</p>
            <p /* TODO - make small */>Velg minimum ett alternativ fra listen under</p>
          </ExpandableCard>
          <p>TODO - Knapp for å legge til et regelsett til</p>
        </div>
      </div>
    </div>
  );
};
