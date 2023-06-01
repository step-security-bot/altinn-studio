import React from 'react';
import classes from './App.module.css';
import './App.css';
import { PageSpinner } from 'app-shared/components';

import { PageLayout } from 'resourceadm/pages/PageLayout';
import { ResourceDashboard } from '../pages/ResourceDashboard';
import { RessurstilgangSide1 } from '../pages/RessurstilgangSide1';
import { OlsenbandenPage } from '../pages/OlsenbandenPage';
import { TestPage } from '../pages/TestPage';
import { PolicyEditorStartPage } from 'resourceadm/pages/PolicyEditorStartPage';
import { PolicyEditor } from 'resourceadm/pages/PolicyEditor';

import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useUserQuery } from 'app-shared/hooks/queries';
import { useOrganizationsQuery } from '../hooks/queries';

import { ErrorMessage } from 'resourceadm/components/ErrorMessage';
import { ResourcePage } from 'resourceadm/pages/ResourcePage';

export const App = (): JSX.Element => {
  const { t } = useTranslation();

  const { data: user, isError: isUserError } = useUserQuery();
  const { data: organizations, isError: isOrganizationsError } = useOrganizationsQuery();

  const componentIsReady = user && organizations;
  const componentHasError = isUserError || isOrganizationsError;

  const getErrorMessage = (): { title: string; message: string } => {
    const defaultTitle = 'Feil oppstod ved innlasting av';
    const defaultMessage = 'Vi beklager men en feil oppstod ved henting av';
    if (isUserError) {
      return {
        title: `${defaultTitle} brukerdata`,
        message: `${defaultMessage} dine brukerdata.`,
      };
    }
    if (isOrganizationsError) {
      return {
        title: `${defaultTitle} organisasjoner`,
        message: `${defaultMessage} organisasjoner som kreves for å kjøre applikasjonen.`,
      };
    }
    return {
      title: 'Ukjent feil oppstod',
      message: 'Vi beklager men en ukjent feil, vennligst prøv igjen senere.',
    };
  };

  if (componentHasError) {
    const error = getErrorMessage();
    return <ErrorMessage title={error.title} message={error.message} />;
  }

  if (componentIsReady) {
    return (
      <div className={classes.root}>
        <Routes>
          <Route element={<TestPage />}>
            <Route
              path='/'
              element={<ResourceDashboard user={user} organizations={organizations} />}
            />
          </Route>

          <Route element={<PageLayout />}>
            <Route
              path='/skatt/repo1'
              element={<ResourceDashboard user={user} organizations={organizations} />}
            />
          </Route>

          <Route path='/skatt/dummy1' element={<RessurstilgangSide1 />} />

          <Route path='/olsenbanden' element={<OlsenbandenPage />} />

          <Route path='/PolicyEditorStartPage' element={<PolicyEditorStartPage />} />
          <Route path='/policyEditor' element={<PolicyEditor />} />

          <Route path={`/resource/:pageType`} element={<ResourcePage />} />
        </Routes>
      </div>
    );
  }

  return <PageSpinner text={t('dashboard.loading')} />;
};
