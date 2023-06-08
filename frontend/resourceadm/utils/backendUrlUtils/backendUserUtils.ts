const basePath = 'http://studio.localhost/designer/api'

/**
 * Gets the URL path to the API for policies
 *
 * @param selectedContext the organisation
 * @param repo the repo
 * @param resourceId the id of the resource
 *
 * @returns the url path string
 */
export const getPolicyUrlBySelectedContextRepoAndId = (
  selectedContext: string,
  repo: string,
  resourceId: string
): string => {
  return `${basePath}/${selectedContext}/${repo}/policy/${resourceId}`
}

/**
 * Gets the URL path to the API for the subject options for a policy
 *
 * @param selectedContext the organisation
 * @param repo the repo
 *
 * @returns the url path string
 */
export const getSubjectOptionsUrlBySelectedContextAndRepo = (
  selectedContext: string,
  repo: string
): string => {
  return `${basePath}/${selectedContext}/${repo}/policy/subjectoptions`
}

/**
 * Gets the URL path to the API for the action options for a policy
 *
 * @param selectedContext the organisation
 * @param repo the repo
 *
 * @returns the url path string
 */
export const getActionOptionsUrlBySelectedContextAndRepo = (
  selectedContext: string,
  repo: string
): string => {
  return `${basePath}/${selectedContext}/${repo}/policy/actionoptions`
}