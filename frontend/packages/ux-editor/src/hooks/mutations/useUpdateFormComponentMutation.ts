import { IInternalLayout } from '../../types/global';
import { useMutation } from '@tanstack/react-query';
import { ComponentType } from 'app-shared/types/ComponentType';
import { useAddAppAttachmentMetadataMutation } from './useAddAppAttachmentMetadataMutation';
import { useDeleteAppAttachmentMetadataMutation } from './useDeleteAppAttachmentMetadataMutation';
import { useUpdateAppAttachmentMetadataMutation } from './useUpdateAppAttachmentMetadataMutation';
import { switchSelectedFieldId } from '../../utils/ruleConfigUtils';
import { useRuleConfigQuery } from '../queries/useRuleConfigQuery';
import { useRuleConfigMutation } from './useRuleConfigMutation';
import { useFormLayoutsSelector } from '../useFormLayoutsSelector';
import { selectedLayoutWithNameSelector } from '../../selectors/formLayoutSelectors';
import { deepCopy } from 'app-shared/pure';
import { useFormLayoutMutation } from './useFormLayoutMutation';
import type { FormComponent, FormFileUploaderComponent } from '../../types/FormComponent';
import { useLayoutSetsQuery } from '../queries/useLayoutSetsQuery';
import { TASKID_FOR_STATELESS_APPS } from 'app-shared/constants';

export interface UpdateFormComponentArgs {
  updatedComponent: FormComponent;
  id: string;
}

export const useUpdateFormComponentMutation = (org: string, app: string, layoutSetName: string) => {
  const { layout, layoutName } = useFormLayoutsSelector(selectedLayoutWithNameSelector);
  const { mutateAsync: saveLayout } = useFormLayoutMutation(org, app, layoutName, layoutSetName);
  const { data: ruleConfig } = useRuleConfigQuery(org, app, layoutSetName);
  const addAppAttachmentMetadataMutation = useAddAppAttachmentMetadataMutation(org, app);
  const deleteAppAttachmentMetadataMutation = useDeleteAppAttachmentMetadataMutation(org, app);
  const updateAppAttachmentMetadata = useUpdateAppAttachmentMetadataMutation(org, app);
  const { data: layoutSets } = useLayoutSetsQuery(org, app);
  const { mutateAsync: saveRuleConfig } = useRuleConfigMutation(org, app, layoutSetName);
  return useMutation({
    mutationFn: ({ updatedComponent, id }: UpdateFormComponentArgs) => {

      const updatedLayout: IInternalLayout = deepCopy(layout);
      const { components, order } = updatedLayout;

      const currentId = id;
      const newId = updatedComponent.id;

      if (currentId !== newId) {
        components[newId] = {
          ...components[id],
          ...updatedComponent,
        };
        delete components[id];

        // Update ID in parent container order
        const parentContainerId = Object.keys(order).find(
          (containerId) => order[containerId].indexOf(id) > -1
        );
        const parentContainerOrder = order[parentContainerId];
        const containerIndex = parentContainerOrder.indexOf(id);
        parentContainerOrder[containerIndex] = newId;
      } else {
        components[id] = {
          ...components[id],
          ...updatedComponent,
        };
      }

      return saveLayout(updatedLayout).then(async (data) => {
        if (updatedComponent.type === ComponentType.FileUpload || updatedComponent.type === ComponentType.FileUploadWithTag) {
          // Todo: Consider handling this in the backend
          const taskId = layoutSets ? layoutSets?.sets.find(set => set.id === layoutSetName)?.tasks[0] : TASKID_FOR_STATELESS_APPS;
          const { maxNumberOfAttachments, minNumberOfAttachments, maxFileSizeInMB, validFileEndings } =
            updatedComponent as FormFileUploaderComponent;
          if (id !== updatedComponent.id) {
            await addAppAttachmentMetadataMutation.mutateAsync({
              fileType: validFileEndings,
              id: updatedComponent.id,
              taskId: taskId,
              maxCount: maxNumberOfAttachments,
              maxSize: maxFileSizeInMB,
              minCount: minNumberOfAttachments,
            }).then(() => deleteAppAttachmentMetadataMutation.mutateAsync(id));
          } else {
            await updateAppAttachmentMetadata.mutateAsync({
              fileType: validFileEndings,
              id,
              taskId: taskId,
              maxCount: maxNumberOfAttachments,
              maxSize: maxFileSizeInMB,
              minCount: minNumberOfAttachments,
            });
          }
          return data;
        }
      }).then(() => ({ currentId, newId }));
    },
    onSuccess: async ({ currentId, newId }) => {
      await switchSelectedFieldId(ruleConfig, currentId, newId, saveRuleConfig);
    }
  });
}
