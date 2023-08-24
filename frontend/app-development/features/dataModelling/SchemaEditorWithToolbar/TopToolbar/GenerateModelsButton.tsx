import { Button, Spinner } from '@digdir/design-system-react';
import { CogIcon } from '@navikt/aksel-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSchemaQuery } from '../../../../hooks/queries';
import { useGenerateModelsMutation } from '../../../../hooks/mutations';
import { toast } from 'react-toastify';

export interface GenerateModelsButtonProps {
  modelPath: string;
}

export const GenerateModelsButton = ({ modelPath }: GenerateModelsButtonProps) => {
  const { data } = useSchemaQuery(modelPath);
  const { mutate, isLoading } = useGenerateModelsMutation(modelPath);
  const { t } = useTranslation();

  const handleGenerateButtonClick = () => {
    mutate(data, {
      onSuccess: () => {
        toast.success(t('general.saved'));
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <Spinner title={t('general.saving')} />
      ) : (
        <Button
          id='save-model-button'
          data-testid='save-model-button'
          onClick={handleGenerateButtonClick}
          icon={<CogIcon />}
          variant='quiet'
          size='small'
        >
          {t('schema_editor.generate_model_files')}
        </Button>
      )}
    </>
  );
};
