import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PageSpinner } from 'app-shared/components';
import { Center } from 'app-shared/components/Center';
import { Alert, ErrorMessage, Paragraph } from '@digdir/design-system-react';
import { SchemaEditorWithToolbar } from './SchemaEditorWithToolbar';
import { useDatamodelsJsonQuery, useDatamodelsXsdQuery } from 'app-shared/hooks/queries';
import { useParams } from 'react-router-dom';
import { mergeQueryStatuses } from 'app-shared/utils/tanstackQueryUtils';
import { mergeJsonAndXsdData } from '../../utils/metadataUtils';

interface DataModellingProps {
  createPathOption?: boolean;
}

export function DataModelling({
  createPathOption = false,
}: DataModellingProps): ReactNode {
  const { t } = useTranslation();
  const { org, app } = useParams<{ org: string; app: string }>();
  const { status: jsonStatus, error: jsonError, data: jsonData } = useDatamodelsJsonQuery(org, app);
  const { status: xsdStatus, error: xsdError, data: xsdData } = useDatamodelsXsdQuery(org, app);

  switch (mergeQueryStatuses(jsonStatus, xsdStatus)) {
    case 'loading':
      return <PageSpinner />;
    case 'error':
      return (
        <Center>
          <Alert severity='danger'>
            <Paragraph>{t('general.fetch_error_message')}</Paragraph>
            <Paragraph>{t('general.error_message_with_colon')}</Paragraph>
            {jsonError && <ErrorMessage>{jsonError.message}</ErrorMessage>}
            {xsdError && <ErrorMessage>{xsdError.message}</ErrorMessage>}
          </Alert>
        </Center>
      );
    case 'success': {
      const data = mergeJsonAndXsdData(jsonData, xsdData);
      return (
        <SchemaEditorWithToolbar
          createPathOption={createPathOption}
          datamodels={data}
        />
      );
    }
  }
}
