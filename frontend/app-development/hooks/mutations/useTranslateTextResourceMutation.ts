import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TranslateTextResourceMutation } from '@altinn/text-editor/src/types';
import { translateTextResource } from '../../queries/mutations';
import { QueryKey } from '../../types/QueryKey';

export const useTranslateTextResourceMutation = (owner, app) => {
  const q = useQueryClient();
  return useMutation({
    mutationFn: ({ textId, language, translation }: TranslateTextResourceMutation) =>
      translateTextResource(owner, app, language, { id: textId, value: translation }),
    onSuccess: () => q.invalidateQueries({ queryKey: [QueryKey.TextResources, owner, app] }),
  });
};
