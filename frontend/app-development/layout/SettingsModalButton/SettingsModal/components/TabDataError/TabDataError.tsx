import React, { ReactNode } from 'react';
import { Alert, Paragraph } from '@digdir/design-system-react';
import { useTranslation } from 'react-i18next';
import { Center } from 'app-shared/components/Center';

export type TabDataErrorProps = {
  children: ReactNode;
};

export const TabDataError = ({ children }: TabDataErrorProps): ReactNode => {
  const { t } = useTranslation();
  return (
    <Center>
      <Alert severity='danger'>
        <Paragraph>{t('general.fetch_error_message')}</Paragraph>
        <Paragraph>{t('general.error_message_with_colon')}</Paragraph>
        {children}
      </Alert>
    </Center>
  );
};
