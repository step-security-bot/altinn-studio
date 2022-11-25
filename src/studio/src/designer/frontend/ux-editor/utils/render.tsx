import React from 'react';
import { Typography } from '@mui/material';
import Select from 'react-select';
import { SelectDataModelComponent } from '../components/config/SelectDataModelComponent';
import { getTextResource, truncate } from './language';
import type { IDataModelBindings, ITextResource } from '../types/global';

export const styles = {
  inputHelper: {
    fontSize: '1.6rem',
    lineHeight: 'auto',
    color: '#000000',
  },
  optional: {
    marginTop: '2.4rem',
    marginLeft: '0.4rem',
    color: '#6A6A6A',
    fontSize: '1.4rem',
  },
  description: {
    fontSize: '1.4rem',
  },
};

export const selectStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: '0 !important',
  }),
  option: (provided: any) => ({
    ...provided,
    whiteSpace: 'pre-wrap',
  }),
};

export interface IPropertyLabelProps {
  textKey: string;
  htmlFor?: string;
}

export const PropertyLabel = ({ textKey, htmlFor }: IPropertyLabelProps) => {
  return (
    <Typography
      style={styles.inputHelper}
      component='label'
      htmlFor={htmlFor}
    >
      {textKey}
    </Typography>
  );
};

export function renderOptionalLabel(text: string) {
  return <Typography style={styles.optional}>{`(${text.toLowerCase()})`}</Typography>;
}

export function renderDescription(text: string) {
  return (
    <Typography
      data-testid='renderDescription'
      style={styles.description}
    >
      {text}
    </Typography>
  );
}

export function noOptionsMessage(language: any): string {
  return language['general.no_options'];
}

export interface IRenderSelectDataModelBinding {
  dataModelBinding: IDataModelBindings;
  onDataModelChange: any;
  language: any;
  label?: string;
  returnValue?: any;
  key?: string;
  uniqueKey?: any;
}

export function renderSelectDataModelBinding({
  dataModelBinding,
  onDataModelChange,
  language,
  label,
  returnValue,
  key = 'simpleBinding',
  uniqueKey,
}: IRenderSelectDataModelBinding): JSX.Element {
  const onDMChange = (dataModelField: any) => onDataModelChange(dataModelField, returnValue);
  const noOptMessage = () => noOptionsMessage(language);
  return (
    <div key={uniqueKey || ''}>
      <PropertyLabel
        textKey={
          label
            ? `${language['ux_editor.modal_properties_data_model_helper']} ${language['general.for']} ${label}`
            : language['ux_editor.modal_properties_data_model_helper']
        }
      />
      <SelectDataModelComponent
        selectedElement={dataModelBinding[key]}
        onDataModelChange={onDMChange}
        language={language}
        noOptionsMessage={noOptMessage}
      />
    </div>
  );
}

export function renderSelectGroupDataModelBinding(
  dataModelBinding: IDataModelBindings,
  onDataModelChange: any,
  language: any,
  key = 'simpleBinding',
): JSX.Element {
  return (
    <div>
      <PropertyLabel textKey={language['ux_editor.modal_properties_data_model_helper']} />

      <SelectDataModelComponent
        selectedElement={dataModelBinding[key]}
        onDataModelChange={(dataModelField) => onDataModelChange(dataModelField, key)}
        language={language}
        selectGroup={true}
        noOptionsMessage={() => noOptionsMessage(language)}
      />
    </div>
  );
}

export interface ISelectTextFromRecources {
  labelText: string;
  onChangeFunction: (e: any) => void;
  textResources: ITextResource[];
  language: any;
  selected?: string;
  placeholder?: string;
  description?: string;
  children?: React.ReactNode;
  inputId?: string;
}

export const SelectTextFromRecources = ({
  labelText,
  onChangeFunction,
  textResources,
  language,
  selected,
  placeholder,
  description,
  inputId,
  children,
}: ISelectTextFromRecources) => {
  const resources = !textResources
    ? []
    : textResources.map((textResource: any) => {
        const option = truncate(textResource.value, 80);
        return {
          value: textResource.id,
          label: `${option}\n(${textResource.id})`,
        };
      });
  const defaultValue = !selected ? undefined : resources.find(({ value }) => value === selected);
  const onChange = (value: any) => onChangeFunction(value);
  const noOptMessage = () => noOptionsMessage(language);
  const placeholderText = placeholder
    ? truncate(getTextResource(placeholder, textResources), 40)
    : language[`ux_editor.${labelText}`];

  return (
    <div>
      <div
        data-testid='SelectTextFromRecources-label'
        style={{ display: 'flex' }}
      >
        <PropertyLabel
          textKey={language[`ux_editor.${labelText}`]}
          htmlFor={inputId}
        />
        {children}
      </div>
      {description && renderDescription(description)}
      <Select
        defaultValue={defaultValue}
        styles={selectStyles}
        options={resources}
        onChange={onChange}
        isClearable={true}
        placeholder={!defaultValue && placeholderText}
        noOptionsMessage={noOptMessage}
        inputId={inputId}
      />
    </div>
  );
};

export function renderOptionalSelectTextFromResources(
  labelText: string,
  onChangeFunction: (e: any) => void,
  textResources: ITextResource[],
  language: any,
  selected?: string,
  placeholder?: string,
  description?: string,
): JSX.Element {
  return (
    <SelectTextFromRecources
      labelText={labelText}
      onChangeFunction={onChangeFunction}
      textResources={textResources}
      language={language}
      selected={selected}
      placeholder={placeholder}
      description={description}
    >
      {renderOptionalLabel(language['general.optional'])}
    </SelectTextFromRecources>
  );
}
