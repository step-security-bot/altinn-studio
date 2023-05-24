import React from 'react';
import { ExpandableCard } from '../ExpandableCard';
import classes from './ExpandablePolicyCard.module.css';

export const ExpandablePolicyCard = () => {
  return (
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
  );
};
