import React, { useState } from 'react';
import { Button, TextArea } from '@digdir/design-system-react';
import { Chip } from '../Chip';
import { ExpandableCard } from '../ExpandableCard';
import classes from './ExpandablePolicyCard.module.css';
import { PolicyRuleCardType, PolicyRuleResourceType } from 'resourceadm/types/global';
import { PolicyResourceFields } from '../PolicyResourceFields';

interface Props {
  policyRule: PolicyRuleCardType;
  actions: string[];
}

// TODO - Make it possible to delete a policy too
export const ExpandablePolicyCard = ({ policyRule, actions }: Props) => {
  const [reasonText, setReasonText] = useState('');

  // TODO - make it controllable by parent
  const [resources, setResources] = useState(policyRule.Resources);
  const [selectedActions, setSelectedActions] = useState(policyRule.Actions);

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

  /**
   * Displays the actions
   */
  const displayActions = actions.map((a, i) => {
    return (
      <Chip
        key={i}
        text={a}
        isSelected={selectedActions.includes(a)}
        onClick={() => handleClickAction(i, a)}
      />
    );
  });

  /**
   * Removes or adds an action
   */
  const handleClickAction = (index: number, action: string) => {
    // If already present, remove it
    if (selectedActions.includes(actions[index])) {
      const updatedSelectedActions = [...selectedActions];
      const selectedActionIndex = selectedActions.findIndex((a) => a === action);
      updatedSelectedActions.splice(selectedActionIndex, 1);
      setSelectedActions(updatedSelectedActions);
    }
    // else add it
    else {
      const updatedSelectedActions = [...selectedActions];
      updatedSelectedActions.push(action);
      setSelectedActions(updatedSelectedActions);
    }
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
      <div className={classes.chipWrapper}>{displayActions}</div>
      <p className={classes.subHeader}>Hvem skal ha disse rettighetene?</p>
      <p>TODO</p>
      {/*<p className={classes.subHeader}>Hvorfor har du tatt disse valgene?</p>
      <p className={classes.text}>Beskriv grunnlaget for hvorfor disse rettighetene gis</p>
      <div className={classes.textAreaWrapper}>
        <TextArea
          resize='vertical'
          placeholder='Grunnlag beskrevet her i tekst av tjenesteeier'
          value={reasonText}
          onChange={(e) => setReasonText(e.currentTarget.value)}
        />
    </div>*/}
      <p className={classes.subHeader}>Legg til en beskrivelse av regelen</p>
      <div className={classes.textAreaWrapper}>
        <TextArea
          resize='vertical'
          placeholder='Beskrivelse beskrevet her i tekst av tjenesteeier'
          value={reasonText}
          onChange={(e) => setReasonText(e.currentTarget.value)}
        />
      </div>
    </ExpandableCard>
  );
};
