import React from 'react';
import { Button, Checkbox, FieldSet, HelpText, TextField } from '@digdir/design-system-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedItemSelector } from '@altinn/schema-editor/selectors/schemaStateSelectors';
import { KeyValuePairs } from 'app-shared/types/KeyValuePairs';
import { setCustomProperties } from '../../features/editor/schemaEditorSlice';
import { CustomPropertyType, deleteProperty, propertyType, setProperty } from '@altinn/schema-model';
import { TrashIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import classes from './CustomProperties.module.css';

export interface CustomPropertiesProps {
  path: string;
}

const inputId = (key: string) => `custom-property-${key}`;

export const CustomProperties = ({ path }: CustomPropertiesProps) => {
  const { custom } = useSelector(selectedItemSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function changeProperties(properties: KeyValuePairs) {
    dispatch(setCustomProperties({ path, properties }));
  }

  function handlePropertyChange<T>(key: string, value: T) {
    changeProperties(setProperty(custom, key, value));
  }

  function deleteCustomProperty(key: string) {
    changeProperties(deleteProperty(custom, key));
  }

  function renderInput(key: string) {
    const id = inputId(key);
    switch (propertyType(custom, key)) {
      case CustomPropertyType.String:
        return (
          <StringInput
            id={id}
            value={custom[key]}
            onChange={(value) => handlePropertyChange<string>(key, value)}
          />
        );
      case CustomPropertyType.Number:
        return (
          <NumberInput
            id={id}
            value={custom[key]}
            onChange={(value) => handlePropertyChange<number>(key, value)}
          />
        );
      case CustomPropertyType.Boolean:
        return (
          <BooleanInput
            id={id}
            value={custom[key]}
            onChange={(value) => handlePropertyChange<boolean>(key, value)}
          />
        );
      default:
        return <UnsupportedInput />;
    }
  }

  function renderKey(key: string)  {
    return propertyType(custom, key) === CustomPropertyType.Unsupported
      ? key
      : <label htmlFor={inputId(key)}>{key}</label>;
  }

  return (
    <FieldSet
      contentClassName={classes.root}
      helpText={t('schema_editor.custom_props_help')}
      legend={t('schema_editor.custom_props')}
    >
      {Object.keys(custom).map((key) => (
        <div key={key} className={classes.listItem}>
          <span className={classes.data}>
            <span>{renderKey(key)}</span>
            <span>{renderInput(key)}</span>
          </span>
          <Button
            className={classes.deleteButton}
            icon={<TrashIcon/>}
            onClick={() => deleteCustomProperty(key)}
            title={t('general.delete')}
          />
        </div>
      ))}
    </FieldSet>
  );
};

export interface InputProps<T> {
  id: string;
  value: T;
  onChange: (value: T) => void;
}

export const StringInput = ({ id, value, onChange }: InputProps<string>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  return <TextField id={id} value={value} onChange={handleChange}/>;
};

export const NumberInput = ({ id, value, onChange }: InputProps<number>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value));
  return <TextField id={id} formatting={{ number: {} }} value={value.toString()} onChange={handleChange} />;
};

export const BooleanInput = ({ id, value, onChange }: InputProps<boolean>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked);
  return <Checkbox checkboxId={id} onChange={handleChange} checked={value} />;
};

export const UnsupportedInput = () => {
  const { t } = useTranslation();
  return (
    <span className={classes.unknownFormatValue}>
      {t('schema_editor.custom_props_unknown_format')}
      <HelpText title={t('general.help')}>
        {t('schema_editor.custom_props_unknown_format_help')}
      </HelpText>
    </span>
  );
};
