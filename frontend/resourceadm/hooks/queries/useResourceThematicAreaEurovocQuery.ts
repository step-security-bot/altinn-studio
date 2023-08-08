import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useServicesContext } from "app-shared/contexts/ServicesContext";
import { QueryKey } from "app-shared/types/QueryKey";
import { ResourceThematicType } from "resourceadm/types/global";

/**
 * Query to get the list of thematic area eurovoc for the resource. It only returns the
 * uri of the eurovoc from backend.
 *
 * @param org the organisation of the user
 *
 * @returns UseQueryResult with a list of thematic areas of ResourceThematicType
 */
export const useResourceThematicAreaEurovocQuery = (org: string): UseQueryResult<ResourceThematicType[]> => {
  const { getResourceThematicEurovoc } = useServicesContext();

  return useQuery<ResourceThematicType[]>(
    [QueryKey.ResourceThematicEurovoc, org],
    () => getResourceThematicEurovoc(org), { select: (data) => data.map(d => ({
      uri: d.uri
    })) }
  )
}