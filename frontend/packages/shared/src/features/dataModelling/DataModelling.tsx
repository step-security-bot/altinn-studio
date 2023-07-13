import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Panel } from '@altinn/altinn-design-system';
import { Button, ButtonColor, ButtonVariant } from '@digdir/design-system-react';
import { SchemaEditorApp } from '@altinn/schema-editor/index';
import { IDataModellingState, createDataModel, deleteDataModel, fetchDataModel, saveDataModel } from './sagas';
import { createDataModelMetadataOptions } from './functions/createDataModelMetadataOptions';
import { findPreferredMetadataOption } from './functions/findPreferredMetadataOption';
import { schemaPathIsSame } from './functions/schemaPathIsSame';
import { DataModelsMetadataActions, LoadingState } from './sagas/metadata';
import type { IMetadataOption } from './functions/types';
import { LandingPagePanel } from './components/LandingPagePanel';
import { Dialog } from '@mui/material';
import { getLocalStorageItem, setLocalStorageItem } from './functions/localStorage';
import classes from './DataModelling.module.css';
import { useTranslation } from 'react-i18next';
import { JsonSchema } from 'app-shared/types/JsonSchema';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app-development/store';

interface IDataModellingContainerProps extends React.PropsWithChildren<any> {
  org: string;
  repo: string;
  createPathOption?: boolean;
}

type shouldSelectFirstEntryProps = {
  metadataOptions?: IMetadataOption[];
  selectedOption?: any;
  metadataLoadingState: LoadingState;
};

export const shouldSelectFirstEntry = ({
  metadataOptions,
  selectedOption,
  metadataLoadingState,
}: shouldSelectFirstEntryProps) => {
  return (
    metadataOptions?.length > 0 &&
    selectedOption === undefined &&
    metadataLoadingState === LoadingState.ModelsLoaded
  );
};

export const jsonSchemaStateSelector = createSelector
(
  (state: RootState) => state.dataModelling,
  (dataModelling: IDataModellingState) => ({ error: dataModelling.error, saving: dataModelling.saving })
);

export function DataModelling({
  org,
  repo,
  createPathOption = false,
}: IDataModellingContainerProps): ReactNode {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const jsonSchemaState = useSelector(jsonSchemaStateSelector);
  const metadataOptions = useSelector(createDataModelMetadataOptions, shallowEqual);
  const metadataLoadingState = useSelector((state: any) => state.dataModelsMetadataState.loadState);
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [createNewOpen, setCreateNewOpen] = useState(false);

  const uploadedOrCreatedFileName = useRef(null);
  const prevFetchedOption = useRef(null);

  const modelNames =
    metadataOptions?.map(({ label }: { label: string }) => label.toLowerCase()) || [];

  useEffect(() => {
    if (metadataLoadingState === LoadingState.LoadingModels) {
      setSelectedOption(undefined);
    } else if (
      shouldSelectFirstEntry({
        metadataOptions,
        selectedOption,
        metadataLoadingState,
      })
    ) {
      setSelectedOption(metadataOptions[0].options[0]);
    } else {
      const option = findPreferredMetadataOption(
        metadataOptions,
        uploadedOrCreatedFileName.current
      );
      if (option) {
        setSelectedOption(option);
        uploadedOrCreatedFileName.current = null;
      }
    }
  }, [metadataOptions, selectedOption, metadataLoadingState]);
  useEffect(() => {
    if (!schemaPathIsSame(prevFetchedOption?.current, selectedOption)) {
      dispatch(fetchDataModel({ metadata: selectedOption, org, app: repo }));
      prevFetchedOption.current = selectedOption;
      if (selectedOption.value.fileName.endsWith('.xsd')) {
        const filename = selectedOption.value.fileName;
        const lowerCaseFileName = filename.toLowerCase();
        const filenameWithoutXsd = lowerCaseFileName.split('.xsd')[0];
        uploadedOrCreatedFileName.current = filename.substring(0, filenameWithoutXsd.length);
      }
    }
  }, [selectedOption, dispatch, org, repo]);

  const handleSaveSchema = (schema: JsonSchema) =>
    dispatch(saveDataModel({ schema, metadata: selectedOption }));

  const handleDeleteSchema = () => {
    dispatch(deleteDataModel({ metadata: selectedOption, org, app: repo }));
    // Needs to reset prevFetchedOption when deleting the data model.
    prevFetchedOption.current = null;
  };
  const handleCreateNewFromLandingPage = () => setCreateNewOpen(true);

  const handleCreateSchema = (model: { name: string; relativeDirectory?: string }) => {
    dispatch(createDataModel(model));
    uploadedOrCreatedFileName.current = model.name;
    setCreateNewOpen(false);
  };

  const handleXsdUploaded = (filename: string) => {
    const lowerCaseFileName = filename.toLowerCase();
    const filenameWithoutXsd = lowerCaseFileName.split('.xsd')[0];
    uploadedOrCreatedFileName.current = filename.substring(0, filenameWithoutXsd.length);
    dispatch(DataModelsMetadataActions.getDataModelsMetadata());
  };

  const [hideIntroPage, setHideIntroPage] = useState(
    () => getLocalStorageItem('hideIntroPage') ?? false
  );
  const handleHideIntroPageButtonClick = () =>
    setHideIntroPage(setLocalStorageItem('hideIntroPage', true));

  const [editMode, setEditMode] = useState(() => getLocalStorageItem('editMode'));
  const toggleEditMode = () => setEditMode(setLocalStorageItem('editMode', !editMode));

  return (
    <>
      <Dialog open={!hideIntroPage}>
        <Panel forceMobileLayout={true} title={t('schema_editor.info_dialog_title')}>
          <div>
            <p>{t('schema_editor.info_dialog_1')}</p>
            <p>{t('schema_editor.info_dialog_2')}</p>
            <p>
              {t('schema_editor.info_dialog_3')}{' '}
              <a href='https://docs.altinn.studio/app/development/data/data-model/'>
                {t('schema_editor.info_dialog_docs_link')}
              </a>
            </p>
          </div>
          <span className={classes.button}>
            <Button
              color={ButtonColor.Primary}
              onClick={() => setHideIntroPage(true)}
              variant={ButtonVariant.Outline}
            >
              Lukk
            </Button>
          </span>
          <span className={classes.button}>
            <Button
              color={ButtonColor.Secondary}
              onClick={handleHideIntroPageButtonClick}
              variant={ButtonVariant.Outline}
            >
              Ikke vis igjen
            </Button>
          </span>
        </Panel>
      </Dialog>
      <SchemaEditorApp
        editMode={editMode}
        toggleEditMode={toggleEditMode}
        modelPath={selectedOption?.value?.repositoryRelativeUrl}
        name={selectedOption?.label}
        schemaState={jsonSchemaState}
        onSaveSchema={handleSaveSchema}
        loading={metadataLoadingState === LoadingState.LoadingModels}
        toolbarProps={{
          handleDeleteSchema,
          handleCreateSchema,
          modelNames,
          selectedOption,
          setSelectedOption,
          createPathOption,
          createNewOpen,
          handleXsdUploaded,
          setCreateNewOpen,
          metadataOptions,
        }}
        LandingPagePanel={
          hideIntroPage && (
            <LandingPagePanel
              org={org}
              repo={repo}
              handleXSDUploaded={handleXsdUploaded}
              handleCreateModelClick={handleCreateNewFromLandingPage}
            />
          )
        }
      />
    </>
  );
}
