import React, { useState } from 'react';
import { Button, TextArea } from '@digdir/design-system-react';
import { Chip } from '../Chip';
import { ExpandableCard } from '../ExpandableCard';
import classes from './ExpandablePolicyCard.module.css';
import { PolicyRuleCardType, PolicyRuleResourceType } from 'resourceadm/types/global';
import { PolicyResourceFields } from '../PolicyResourceFields';

interface Props {
  policyRule: PolicyRuleCardType;
}

// TODO - Make it possible to delete a policy too
export const ExpandablePolicyCard = ({ policyRule }: Props) => {
  const [isReadSelected, setIsReadSelected] = useState(false);
  const [isWriteSelected, setIsWriteSelected] = useState(false);
  const [isArchiveSelected, setIsArchiveSelected] = useState(false);

  const [reasonText, setReasonText] = useState('');

  // TODO - make it controllable by parent
  const [resources, setResources] = useState(policyRule.Resources);

  const getPolicyRuleId = () => {
    return policyRule.RuleId.toString();
  };

  const displayResources = resources.map((r, i) => {
    return (
      <PolicyResourceFields
        key={i}
        isEditable={i > 0}
        onRemove={() => handleRemoveResource(i)}
        valueId={r.id}
        valueType={r.type}
        onChangeId={(s: string) => handleInputInputChange(i, 'id', s)}
        onChangeType={(s: string) => handleInputInputChange(i, 'type', s)}
      />
    );
  });

  const handleInputInputChange = (index: number, field: 'id' | 'type', value: string) => {
    const updatedResources = [...resources];
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value,
    };
    setResources(updatedResources);
  };

  const handleClickAddResource = () => {
    const newResource: PolicyRuleResourceType = {
      id: '',
      type: '',
    };

    setResources([...resources, newResource]);
  };

  const handleRemoveResource = (index: number) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    setResources(updatedResources);
  };

  return (
    <ExpandableCard cardTitle={`Regel ${getPolicyRuleId()}`}>
      {/*<p className={classes.subHeader}>Hvilket nivå i ressursen skal reglene gjelde?</p>
     <Select
        options={[
          { value: 'Hele ressursen', label: 'Hele ressursen' },
          { value: 'Halve ressursen', label: 'Halve ressursen' },
          { value: '1 ressurs', label: '1 ressurs' },
        ]}
        multiple
      />*/}
      <p className={classes.subHeader}>Hvilken ressurser skal regelen gjelde for?</p>
      {displayResources}
      <Button type='button' onClick={handleClickAddResource}>
        Legg til ressurs
      </Button>
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
