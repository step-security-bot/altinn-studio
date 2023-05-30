import React, { useState } from 'react';
import { Button, Select, TextArea } from '@digdir/design-system-react';
import { Chip } from '../Chip';
import { ExpandableCard } from '../ExpandableCard';
import classes from './ExpandablePolicyCard.module.css';
import {
  PolicyRuleCardType,
  PolicyRuleResourceType,
  PolicySubjectType,
} from 'resourceadm/types/global';
import { PolicyResourceFields } from '../PolicyResourceFields';
import { PolicyRuleSubjectListItem } from '../PolicyRuleSubjectListItem';

interface Props {
  policyRule: PolicyRuleCardType;
  actions: string[];
  subjects: PolicySubjectType[];
  rules: PolicyRuleCardType[];
  setPolicyRules: React.Dispatch<React.SetStateAction<PolicyRuleCardType[]>>;
  rulePosition: number;
}

// TODO - Make it possible to delete a rule too
export const ExpandablePolicyCard = ({
  policyRule,
  actions,
  subjects,
  rules,
  setPolicyRules,
  rulePosition,
}: Props) => {
  // TODO - make it controllable by parent
  const [resources, setResources] = useState(policyRule.Resources);
  const [selectedActions, setSelectedActions] = useState(policyRule.Actions);
  const [ruleDescription, setRuleDescription] = useState(policyRule.Description);

  const updateRules = (d: string, s: string[], a: string[], r: PolicyRuleResourceType[]) => {
    const updatedRules = [...rules];
    updatedRules[rulePosition] = {
      ...updatedRules[rulePosition],
      Description: d,
      Subject: s,
      Actions: a,
      Resources: r,
    };
    setPolicyRules(updatedRules);

    /*
const updatedResources = [...resources];
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value,
    };
    */
  };

  /**
   * Maps the list of policy subject strings from backend of the format "subjectID:subjectResource"
   * to the title of the subject.
   */
  const mapPolicySubjectToSubjectTitle = (policySubjects: string[]): string[] => {
    const subjectIds = policySubjects.map((s) => {
      const splitted = s.split(':');
      return splitted[splitted.length - 1];
    });

    return subjectIds.map((subjectId) => {
      if (subjects.map((s) => s.SubjectId).includes(subjectId)) {
        return subjects.find((s) => s.SubjectId === subjectId).SubjectTitle;
      }
    });
  };
  const [selectedSubjectTitles, setSelectedSubjectTitles] = useState(
    mapPolicySubjectToSubjectTitle(policyRule.Subject)
  );

  /**
   * Maps the subject objects to option objects for display in the select component
   */
  const getSubjectOptions = () => {
    return subjects
      .filter((s) => !selectedSubjectTitles.includes(s.SubjectTitle))
      .map((s) => ({ value: s.SubjectTitle, label: s.SubjectTitle }));
  };
  const [subjectOptions, setSubjectOptions] = useState(getSubjectOptions());

  /**
   * Gets the id of the policy
   */
  const getPolicyRuleId = () => {
    return policyRule.RuleId.toString();
  };

  /**
   * Displays the list of resources
   */
  const displayResources = resources.map((r, i) => {
    return (
      <PolicyResourceFields
        key={i}
        isEditable={i > 0}
        onRemove={() => handleRemoveResource(i)}
        valueId={r.id}
        valueType={r.type}
        onChangeId={(s: string) => handleInputChange(i, 'id', s)}
        onChangeType={(s: string) => handleInputChange(i, 'type', s)}
      />
    );
  });

  /**
   * Handles the changes in the input fields
   */
  const handleInputChange = (index: number, field: 'id' | 'type', value: string) => {
    const updatedResources = [...resources];
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value,
    };

    setResources(updatedResources);

    updateRules(ruleDescription, selectedSubjectTitles, selectedActions, updatedResources);
  };

  /**
   * Handles the addition of more resources
   */
  const handleClickAddResource = () => {
    const newResource: PolicyRuleResourceType = {
      type: '',
      id: '',
    };

    setResources([...resources, newResource]);
  };

  /**
   * Handles the removal of resources
   */
  const handleRemoveResource = (index: number) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    setResources(updatedResources);
    updateRules(ruleDescription, selectedSubjectTitles, selectedActions, updatedResources);
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
      updateRules(ruleDescription, selectedSubjectTitles, updatedSelectedActions, resources);
    }
    // else add it
    else {
      const updatedSelectedActions = [...selectedActions];
      updatedSelectedActions.push(action);
      setSelectedActions(updatedSelectedActions);
      updateRules(ruleDescription, selectedSubjectTitles, updatedSelectedActions, resources);
    }
  };

  /**
   * Displays the selected subjects
   *
   * TODO - When adding the subject, merge it to the string `urn:${subjectsource}:{subjectid}`
   */
  const displaySubjects = selectedSubjectTitles.map((s, i) => {
    return (
      <PolicyRuleSubjectListItem
        key={i}
        subjectTitle={s}
        onRemove={() => handleRemoveSubject(i, s)}
      />
    );
  });

  /**
   * Handles the removal of resources
   */
  const handleRemoveSubject = (index: number, subjectTitle: string) => {
    // Remove from selected list
    const updatedSubjects = [...selectedSubjectTitles];
    updatedSubjects.splice(index, 1);
    setSelectedSubjectTitles(updatedSubjects);

    // Add to options list
    setSubjectOptions([...subjectOptions, { value: subjectTitle, label: subjectTitle }]); // -----------------------

    updateRules(ruleDescription, updatedSubjects, selectedActions, resources);
  };

  /**
   * Handles the click on a subject in the select list. It removes the clicked element
   * from the options list, and adds it to the selected subject title list.
   */
  const handleClickSubjectInList = (option: string[]) => {
    // As the input field is multiple, the onchance function uses string[], but
    // we are removing the element from the options list before it is displayed, so
    // it will only ever be a first value in the array.
    const clickedOption = option[0];

    // Remove from options list
    const index = subjectOptions.findIndex((o) => o.value === clickedOption);
    const updatedOptions = [...subjectOptions];
    updatedOptions.splice(index, 1);
    setSubjectOptions(updatedOptions);

    // Add to selected list
    setSelectedSubjectTitles([...selectedSubjectTitles, clickedOption]);

    updateRules(
      ruleDescription,
      [...selectedSubjectTitles, clickedOption],
      selectedActions,
      resources
    );
  };

  const handleChangeDescription = (description: string) => {
    setRuleDescription(description);
    updateRules(description, selectedSubjectTitles, selectedActions, resources);
  };

  return (
    <ExpandableCard cardTitle={`Regel ${getPolicyRuleId()}`}>
      <p className={classes.subHeader}>Hvilken ressurser skal regelen gjelde for?</p>
      {displayResources}
      <Button type='button' onClick={handleClickAddResource}>
        Legg til en ressurs for å limitere ressursen {/* TODO - Komme med bedre navn*/}
      </Button>
      <p className={classes.subHeader}>Hvilke rettigheter skal gis?</p>
      <p className={classes.smallText}>Velg minimum ett alternativ fra listen under</p>
      <div className={classes.chipWrapper}>{displayActions}</div>
      <p className={classes.subHeader}>Hvem skal ha disse rettighetene?</p>
      {displaySubjects}
      {subjectOptions.length > 0 && (
        <Select
          options={subjectOptions}
          onChange={handleClickSubjectInList}
          label='Legg til fler'
          multiple
        />
      )}
      <p className={classes.subHeader}>Legg til en beskrivelse av regelen</p>
      <div className={classes.textAreaWrapper}>
        <TextArea
          resize='vertical'
          placeholder='Beskrivelse beskrevet her i tekst av tjenesteeier'
          value={ruleDescription}
          onChange={(e) => handleChangeDescription(e.currentTarget.value)}
          rows={5}
        />
      </div>
    </ExpandableCard>
  );
};
