import React, { useState } from 'react';
import { Select, TextArea } from '@digdir/design-system-react';
import { Chip } from '../Chip';
import { ExpandableCard } from '../ExpandableCard';
import classes from './ExpandablePolicyCard.module.css';

export const ExpandablePolicyCard = () => {
  const [isReadSelected, setIsReadSelected] = useState(false);
  const [isWriteSelected, setIsWriteSelected] = useState(false);
  const [isArchiveSelected, setIsArchiveSelected] = useState(false);

  const [reasonText, setReasonText] = useState('');

  return (
    <ExpandableCard cardTitle='Lese, skrive, arkivere'>
      <p className={classes.subHeader}>Hvilket nivå i ressursen skal reglene gjelde?</p>
      <Select
        options={[
          { value: 'Hele ressursen', label: 'Hele ressursen' },
          { value: 'Halve ressursen', label: 'Halve ressursen' },
          { value: '1 ressurs', label: '1 ressurs' },
        ]}
        multiple
      />
      <p className={classes.subHeader}>Hvilke rettigheter skal gis?</p>
      <p className={classes.smallText}>Velg minimum ett alternativ fra listen under</p>
      <div className={classes.chipWrapper}>
        <Chip text='Les' isSelected={isReadSelected} onClick={() => setIsReadSelected((v) => !v)} />
        <Chip
          text='Skriv'
          isSelected={isWriteSelected}
          onClick={() => setIsWriteSelected((v) => !v)}
        />
        <Chip
          text='Arkiver'
          isSelected={isArchiveSelected}
          onClick={() => setIsArchiveSelected((v) => !v)}
        />
        {/* TODO - Find out if it should be added more, and how it should be done */}
      </div>
      <p className={classes.subHeader}>Hvem skal ha disse rettighetene?</p>
      <p>TODO</p>
      <p className={classes.subHeader}>Hvorfor har du tatt disse valgene?</p>
      <p className={classes.text}>Beskriv grunnlaget for hvorfor disse rettighetene gis</p>
      <div className={classes.textAreaWrapper}>
        <TextArea
          resize='vertical'
          placeholder='Grunnlag beskrevet her i tekst av tjenesteeier'
          value={reasonText}
          onChange={(e) => setReasonText(e.currentTarget.value)}
        />
      </div>
    </ExpandableCard>
  );
};
