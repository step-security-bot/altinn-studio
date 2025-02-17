import React, { useState } from 'react';
import { Select, Textfield } from '@digdir/design-system-react';
import { IGenericEditComponent } from '../componentConfig';
import { useOptionListIdsQuery } from '../../../hooks/queries/useOptionListIdsQuery';
import { useTranslation, Trans } from 'react-i18next';
import { AltinnSpinner } from 'app-shared/components';
import { ErrorMessage, Button } from '@digdir/design-system-react';
import { altinnDocsUrl } from 'app-shared/ext-urls';
import { FormField } from '../../FormField';
import { useStudioUrlParams } from 'app-shared/hooks/useStudioUrlParams';

export function EditCodeList({ component, handleComponentChange }: IGenericEditComponent) {
  const { t } = useTranslation();
  const { org, app } = useStudioUrlParams();

  const { data: optionListIds, isLoading, isError, error } = useOptionListIdsQuery(org, app);
  const [useCustomCodeList, setUseCustomCodeList] = useState<boolean>(optionListIds?.length === 0);
  const handleOptionsIdChange = (optionsId: string) => {
    handleComponentChange({
      ...component,
      optionsId,
    });
  };

  return (
    <div>
      {isLoading ? (
        <AltinnSpinner />
      ) : isError ? (
        <ErrorMessage>
          {error instanceof Error ? error.message : t('ux_editor.modal_properties_error_message')}
        </ErrorMessage>
      ) : optionListIds?.length === 0 ? (
        <ErrorMessage>{t('ux_editor.modal_properties_no_options_found_message')}</ErrorMessage>
      ) : (
        <>
          <p>
            <Button
              variant='tertiary'
              onClick={() => setUseCustomCodeList(!useCustomCodeList)}
              size='small'
            >
              {optionListIds?.length > 0 && useCustomCodeList && <>Bytt til statisk kodeliste</>}
              {!useCustomCodeList && <>Bytt til egendefinert kodeliste</>}
            </Button>
          </p>
          {!useCustomCodeList && (
            <FormField
              id={component.id}
              label={t('ux_editor.modal_properties_code_list_id')}
              onChange={handleOptionsIdChange}
              value={component.optionsId}
              propertyPath={`${component.propertyPath}/properties/optionsId`}
            >
              {() => (
                <Select
                  options={optionListIds.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
              )}
            </FormField>
          )}
        </>
      )}
      {
        <>
          {useCustomCodeList && (
            <Textfield
              type='text'
              label={t('ux_editor.modal_properties_custom_code_list_id')}
              onChange={(event) => handleOptionsIdChange(event.target.value)}
              value={component.optionsId}
            />
          )}
        </>
      }
      <p style={{ marginBottom: 0 }}>
        <Trans i18nKey={'ux_editor.modal_properties_code_list_read_more'}>
          <a
            href={altinnDocsUrl('app/development/data/options/')}
            target='_newTab'
            rel='noopener noreferrer'
          />
        </Trans>
      </p>
    </div>
  );
}
