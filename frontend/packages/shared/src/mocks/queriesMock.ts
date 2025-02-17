import { ServicesContextProps } from 'app-shared/contexts/ServicesContext';
import inputComponentSchema from '../../../ux-editor/src/testing/schemas/json/component/Input.schema.v1.json';
import commonDefsComponentSchema from '../../../ux-editor/src/testing/schemas/json/component/Input.schema.v1.json';

export const queriesMock: ServicesContextProps = {
  addAppAttachmentMetadata: jest.fn(),
  addLanguageCode: jest.fn(),
  addLayoutSet: jest.fn(),
  addRepo: jest.fn(),
  addXsdFromRepo: jest.fn(),
  commitAndPushChanges: jest.fn(),
  configureLayoutSet: jest.fn(),
  copyApp: jest.fn(),
  createDatamodel: jest.fn(),
  createDeployment: jest.fn(),
  createRelease: jest.fn(),
  createRepoCommit: jest.fn(),
  createResource: jest.fn(),
  deleteAppAttachmentMetadata: jest.fn(),
  deleteDatamodel: jest.fn(),
  deleteFormLayout: jest.fn(),
  deleteLanguageCode: jest.fn(),
  generateModels: jest.fn(),
  getAppReleases: jest.fn(),
  getBranchStatus: jest.fn(),
  getComponentSchema: jest.fn().mockResolvedValue(inputComponentSchema),
  getComponentsCommonDefsSchema: jest.fn().mockResolvedValue(commonDefsComponentSchema),
  getDatamodel: jest.fn(),
  getDatamodelMetadata: jest.fn(),
  getDatamodelsJson: jest.fn(),
  getDatamodelsXsd: jest.fn(),
  getDeployPermissions: jest.fn(),
  getDeployments: jest.fn(),
  getEnvironments: jest.fn(),
  getExpressionSchema: jest.fn(),
  getFormLayoutSettings: jest.fn(),
  getFormLayouts: jest.fn(),
  getFrontEndSettings: jest.fn(),
  getInstanceIdForPreview: jest.fn(),
  getLayoutSchema: jest.fn(),
  getLayoutSets: jest.fn(),
  getNewsList: jest.fn(),
  getNumberFormatSchema: jest.fn(),
  getOptionListIds: jest.fn(),
  getOrgList: jest.fn(),
  getOrganizations: jest.fn(),
  getPolicy: jest.fn(),
  getPolicyActions: jest.fn(),
  getPolicySubjects: jest.fn(),
  getRepoMetadata: jest.fn(),
  getRepoPull: jest.fn(),
  getRepoStatus: jest.fn(),
  getResource: jest.fn(),
  getResourceList: jest.fn(),
  getResourcePublishStatus: jest.fn(),
  getRuleConfig: jest.fn(),
  getRuleModel: jest.fn(),
  getStarredRepos: jest.fn(),
  getTextLanguages: jest.fn(),
  getTextResources: jest.fn(),
  getUser: jest.fn(),
  getValidatePolicy: jest.fn(),
  getValidateResource: jest.fn(),
  getWidgetSettings: jest.fn(),
  logout: jest.fn(),
  pushRepoChanges: jest.fn(),
  resetRepoChanges: jest.fn(),
  saveDatamodel: jest.fn(),
  saveFormLayout: jest.fn(),
  saveFormLayoutSettings: jest.fn(),
  saveRuleConfig: jest.fn(),
  searchRepos: jest.fn(),
  setStarredRepo: jest.fn(),
  unsetStarredRepo: jest.fn(),
  updateAppAttachmentMetadata: jest.fn(),
  updateFormLayoutName: jest.fn(),
  updatePolicy: jest.fn(),
  updateResource: jest.fn(),
  updateTextId: jest.fn(),
  updateTranslationByLangCode: jest.fn(),
  upsertTextResources: jest.fn(),
  getBpmnFile: jest.fn(),
  updateBpmnXml: jest.fn(),
  getAppPolicy: jest.fn(),
  updateAppPolicy: jest.fn(),
  getAppConfig: jest.fn(),
  getAppMetadata: jest.fn(),
  updateAppMetadata: jest.fn(),
  updateAppConfig: jest.fn(),
  getRepoInitialCommit: jest.fn(),
  publishResource: jest.fn(),
  getAltinn2LinkServices: jest.fn(),
  importResourceFromAltinn2: jest.fn(),
};
