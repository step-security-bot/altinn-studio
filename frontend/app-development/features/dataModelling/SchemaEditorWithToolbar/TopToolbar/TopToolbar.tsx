import React, { useEffect } from 'react';
import classes from './TopToolbar.module.css';
import { CreateNewWrapper } from './CreateNewWrapper';
import { XSDUpload } from './XSDUpload';
import { SchemaSelect } from './SchemaSelect';
import { DeleteWrapper } from './DeleteWrapper';
import { computeSelectedOption } from '../../../../utils/metadataUtils';
import {
  CreateDatamodelMutationArgs,
  useCreateDatamodelMutation
} from '../../../../hooks/mutations/useCreateDatamodelMutation';
import { MetadataOption } from '../../../../types/MetadataOption';
import { GenerateModelsButton } from './GenerateModelsButton';
import { usePrevious } from 'app-shared/hooks/usePrevious';
import { DatamodelMetadata } from 'app-shared/types/DatamodelMetadata';

export interface TopToolbarProps {
  createNewOpen: boolean;
  createPathOption?: boolean;
  datamodels: DatamodelMetadata[];
  selectedOption?: MetadataOption;
  setCreateNewOpen: (open: boolean) => void;
  setSelectedOption: (option?: MetadataOption) => void;
}

export function TopToolbar({
  createNewOpen,
  createPathOption,
  datamodels,
  selectedOption,
  setCreateNewOpen,
  setSelectedOption,
}: TopToolbarProps) {
  const modelPath = selectedOption?.value.repositoryRelativeUrl;

  const { mutate: createDatamodel } = useCreateDatamodelMutation();
  const prevDatamodels = usePrevious(datamodels);

  useEffect(() => {
    setSelectedOption(computeSelectedOption(selectedOption, datamodels, prevDatamodels));
  }, [selectedOption, datamodels, prevDatamodels, setSelectedOption]);

  const handleCreateSchema = (model: CreateDatamodelMutationArgs) => {
    createDatamodel(model);
    setCreateNewOpen(false);
  };

  return (
    <section className={classes.toolbar} role='toolbar'>
      <CreateNewWrapper
        datamodels={datamodels}
        disabled={false}
        createNewOpen={createNewOpen}
        setCreateNewOpen={setCreateNewOpen}
        handleCreateSchema={handleCreateSchema}
        createPathOption={createPathOption}
      />
      <XSDUpload disabled={false}/>
      <SchemaSelect
        datamodels={datamodels}
        disabled={false}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <DeleteWrapper selectedOption={selectedOption}/>
      <div className={classes.right}>
        <div className={classes.generateButtonWrapper}>
          {modelPath && <GenerateModelsButton modelPath={modelPath}/>}
        </div>
      </div>
    </section>
  );
}
