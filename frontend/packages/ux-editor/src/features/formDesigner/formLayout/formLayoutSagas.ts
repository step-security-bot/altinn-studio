import type { SagaIterator } from 'redux-saga';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { del, get, post } from 'app-shared/utils/networking';
import postMessages from 'app-shared/utils/postMessages';
import type { ILayoutSettings } from 'app-shared/types/global';
import Axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  convertFromLayoutToInternalFormat,
  convertInternalToLayoutFormat,
} from '../../../utils/formLayout';

import { layoutSchemaUrl } from 'app-shared/cdn-paths';

import { ComponentTypes } from '../../../components';
import type {
  IAddApplicationMetadataAction,
  IAddFormComponentAction,
  IAddFormContainerAction,
  IAddLayoutAction,
  IDeleteApplicationMetadataAction,
  IDeleteComponentsAction,
  IDeleteContainerAction,
  IDeleteLayoutAction,
  IUpdateApplicationMetadaAction,
  IUpdateFormComponentAction,
  IUpdateLayoutNameAction,
} from '../formDesignerTypes';
import { FormLayoutActions } from './formLayoutSlice';
import type {
  IAppState,
  IFormFileUploaderComponent,
  IInternalLayouts,
  IFormLayouts, IExternalFormLayouts,
} from '../../../types/global';
import { generateComponentId } from '../../../utils/generateId';
import {
  appMetadataAttachmentPath,
  layoutSettingsPath,
  formLayoutsPath,
  formLayoutPath,
  formLayoutNamePath,
} from 'app-shared/api-paths';

const selectCurrentLayout = (state: IAppState): IInternalLayouts =>
  state.formDesigner.layout.layouts[state.formDesigner.layout.selectedLayout];
const selectLayouts = (state: IAppState) => state.formDesigner.layout.layouts;

function* addFormComponentSaga({ payload }: PayloadAction<IAddFormComponentAction>): SagaIterator {
  try {
    let { containerId, position } = payload;
    const { org, app, component, callback } = payload;
    const currentLayout: IInternalLayouts = yield select(selectCurrentLayout);
    const layouts: IFormLayouts = yield select(selectLayouts);
    const id: string = component.id || generateComponentId(component.type, layouts);

    if (!containerId) {
      // if not containerId set it to base-container
      containerId = Object.keys(currentLayout.order)[0];
    }
    if (!position) {
      // if position is undefined, put it on top
      position = 0;
    }

    yield put(
      FormLayoutActions.addFormComponentFulfilled({
        component,
        id,
        position,
        containerId,
        callback,
      })
    );
    yield put(FormLayoutActions.saveFormLayout({ org, app }));

    if (component.type === 'FileUpload') {
      const { maxNumberOfAttachments, minNumberOfAttachments, maxFileSizeInMB, validFileEndings } =
        component as IFormFileUploaderComponent;
      yield put(
        FormLayoutActions.addApplicationMetadata({
          id,
          maxFiles: maxNumberOfAttachments,
          minFiles: minNumberOfAttachments,
          fileType: validFileEndings,
          maxSize: maxFileSizeInMB,
          org,
          app,
        })
      );
    }

    return id; // returns created id
  } catch (error) {
    yield put(FormLayoutActions.addApplicationMetadataRejected({ error }));
    console.error(error);
  }
}

export function* watchAddFormComponentSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.addFormComponent, addFormComponentSaga);
}

function* addFormContainerSaga({ payload }: PayloadAction<IAddFormContainerAction>): SagaIterator {
  try {
    const { container, positionAfterId, addToId, callback, destinationIndex, org, app } = payload;
    const layouts = yield select(selectLayouts);
    const id = generateComponentId('Group', layouts);
    const currentLayout: IInternalLayouts = yield select(selectCurrentLayout);
    let baseContainerId;
    if (Object.keys(currentLayout.order) && Object.keys(currentLayout.order).length > 0) {
      baseContainerId = Object.keys(currentLayout.order)[0];
    }

    yield put(
      FormLayoutActions.addFormContainerFulfilled({
        container,
        id,
        positionAfterId,
        addToId,
        baseContainerId,
        destinationIndex,
        callback,
      })
    );
    yield put(FormLayoutActions.saveFormLayout({ org, app }));
  } catch (error) {
    yield put(FormLayoutActions.addFormContainerRejected({ error }));
  }
}

export function* watchAddFormContainerSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.addFormContainer, addFormContainerSaga);
}

function* deleteFormComponentsSaga({
  payload,
}: PayloadAction<IDeleteComponentsAction>): SagaIterator {
  try {
    const { components, org, app } = payload;
    const currentLayout: IInternalLayouts = yield select(selectCurrentLayout);

    for (const id of components) {
      const component = currentLayout.components[id];
      if (component?.type === 'FileUpload') {
        yield put(FormLayoutActions.deleteApplicationMetadata({ id, org, app }));
      }
    }
    yield put(FormLayoutActions.saveFormLayout({ org, app }));
  } catch (error) {
    console.error(error);
    yield put(FormLayoutActions.deleteFormComponentRejected({ error }));
  }
}

export function* watchDeleteFormComponentSaga(): SagaIterator {
  yield takeEvery(FormLayoutActions.deleteFormComponents, deleteFormComponentsSaga);
}

function* deleteFormContainerSaga({
  payload,
}: PayloadAction<IDeleteContainerAction>): SagaIterator {
  try {
    const { id, index, org, app } = payload;
    const currentLayout: IInternalLayouts = yield select(selectCurrentLayout);
    let parentContainer = Object.keys(currentLayout.order)[0];
    Object.keys(currentLayout.order).forEach((cId) => {
      if (currentLayout.order[cId].find((containerId) => containerId === id)) {
        parentContainer = cId;
      }
    });
    for (const componentId of currentLayout.order[id]) {
      if (Object.keys(currentLayout.components).indexOf(componentId) > -1) {
        yield put(
          FormLayoutActions.deleteFormContainerFulfilled({
            id: componentId,
            parentContainerId: id,
            org,
            app,
          })
        );
      } else {
        yield put(
          FormLayoutActions.deleteFormContainerFulfilled({
            id: componentId,
            index: currentLayout.order[id].indexOf(componentId),
            parentContainerId: id,
            org,
            app,
          })
        );
      }
    }
    yield put(
      FormLayoutActions.deleteFormContainerFulfilled({
        id,
        index,
        parentContainerId: parentContainer,
        org,
        app,
      })
    );
    yield put(FormLayoutActions.saveFormLayout({ org, app }));
  } catch (error) {
    yield put(FormLayoutActions.deleteFormContainerRejected({ error }));
  }
}

export function* watchDeleteFormContainerSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.deleteFormContainer, deleteFormContainerSaga);
}

function* fetchFormLayoutSaga({ payload }: PayloadAction<{ org; app }>): SagaIterator {
  const { org, app } = payload;
  let formLayouts: IExternalFormLayouts;
  try {
    formLayouts = yield call(get, formLayoutsPath(org, app));
  } catch (error) {
    console.error(error);
    yield put(FormLayoutActions.fetchFormLayoutRejected({ error }));
  }
  const convertedLayouts: IFormLayouts = {};
  const invalidLayouts: string[] = [];

  Object.keys(formLayouts).forEach((layoutName: string) => {
    if (!formLayouts[layoutName] || !formLayouts[layoutName].data) {
      convertedLayouts[layoutName] = convertFromLayoutToInternalFormat(null, false);
    } else {
      try {
        convertedLayouts[layoutName] = convertFromLayoutToInternalFormat(
          formLayouts[layoutName].data.layout,
          formLayouts[layoutName]?.data?.hidden
        );
      } catch {
        invalidLayouts.push(layoutName);
      }
    }
  });
  yield put(
    FormLayoutActions.fetchFormLayoutFulfilled({
      formLayout: convertedLayouts,
      invalidLayouts,
    })
  );
  yield put(FormLayoutActions.deleteActiveListFulfilled());
}

export function* watchFetchFormLayoutSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.fetchFormLayout, fetchFormLayoutSaga);
}

function* saveFormLayoutSaga({ payload }: PayloadAction<{ org; app }>): SagaIterator {
  const { org, app } = payload;
  try {
    // Without this delay the selectedLayout is not set with the correct value.
    yield delay(200);
    const selectedLayout = yield select(
      (state: IAppState) => state.formDesigner.layout.selectedLayout
    );

    const layouts = yield select((state: IAppState) => state.formDesigner.layout.layouts);
    const convertedLayout = {
      $schema: layoutSchemaUrl(),
      data: {
        layout: convertInternalToLayoutFormat(layouts[selectedLayout]),
        hidden: layouts[selectedLayout]?.hidden,
      },
    };
    const url = formLayoutPath(org, app, selectedLayout);
    yield call(post, url, convertedLayout);
    yield put(FormLayoutActions.saveFormLayoutFulfilled());
    window.postMessage(postMessages.filesAreSaved, window.location.href);
  } catch (error) {
    console.error(error);
    yield put(FormLayoutActions.saveFormLayoutRejected({ error }));
  }
}

export function* watchSaveFormLayoutSaga(): SagaIterator {
  yield takeLatest(
    [
      FormLayoutActions.saveFormLayout,
      FormLayoutActions.addLayoutFulfilled,
      FormLayoutActions.updateFormComponent,
      FormLayoutActions.updateFormContainer,
      FormLayoutActions.updateFormComponentOrder,
      FormLayoutActions.updateContainerId,
      FormLayoutActions.deleteFormComponents,
    ],
    saveFormLayoutSaga
  );
}

function* updateFormComponentSaga({
  payload,
}: PayloadAction<IUpdateFormComponentAction>): SagaIterator {
  const { updatedComponent, id, org, app } = payload;

  if (updatedComponent.type === 'FileUpload') {
    const { maxNumberOfAttachments, minNumberOfAttachments, maxFileSizeInMB, validFileEndings } =
      updatedComponent as IFormFileUploaderComponent;

    if (id !== updatedComponent.id) {
      yield call(addApplicationMetadata, {
        payload: {
          id: updatedComponent.id,
          fileType: validFileEndings,
          maxFiles: maxNumberOfAttachments,
          maxSize: maxFileSizeInMB,
          minFiles: minNumberOfAttachments,
          org,
          app,
        },
        type: 'addApplicationMetadata',
      });
      yield call(deleteApplicationMetadata, {
        payload: { id, org, app },
        type: 'deleteApplicationMetadata',
      });
    } else {
      yield put(
        FormLayoutActions.updateApplicationMetadata({
          fileType: validFileEndings,
          id,
          maxFiles: maxNumberOfAttachments,
          maxSize: maxFileSizeInMB,
          minFiles: minNumberOfAttachments,
          org,
          app,
        })
      );
    }
  }
}

export function* watchUpdateFormComponentSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.updateFormComponent, updateFormComponentSaga);
}

export function* addApplicationMetadata({
  payload,
}: PayloadAction<IAddApplicationMetadataAction>): SagaIterator {
  try {
    const { id, maxFiles, minFiles, maxSize, fileType, org, app } = payload;
    yield call(post, appMetadataAttachmentPath(org, app), {
      id,
      maxCount: maxFiles,
      minCount: minFiles,
      maxSize,
      fileType,
    });
    yield put(FormLayoutActions.addApplicationMetadataFulfilled());
  } catch (error) {
    yield put(FormLayoutActions.addApplicationMetadataRejected({ error }));
  }
}

export function* watchAddApplicationMetadataSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.addApplicationMetadata, addApplicationMetadata);
}

export function* deleteApplicationMetadata({
  payload,
}: PayloadAction<IDeleteApplicationMetadataAction>): SagaIterator {
  try {
    const { id, org, app } = payload;
    yield call(post, appMetadataAttachmentPath(org, app) + id, {
      id,
    });
    yield put(FormLayoutActions.deleteApplicationMetadataFulfilled());
  } catch (error) {
    yield put(FormLayoutActions.deleteApplicationMetadataRejected({ error }));
  }
}

export function* watchDeleteApplicationMetadataSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.deleteApplicationMetadata, deleteApplicationMetadata);
}

export function* updateApplicationMetadata({
  payload,
}: PayloadAction<IUpdateApplicationMetadaAction>): SagaIterator {
  try {
    const { id, maxFiles, minFiles, maxSize, fileType, org, app } = payload;
    yield call(post, appMetadataAttachmentPath(org, app), {
      id,
      maxCount: maxFiles,
      minCount: minFiles,
      maxSize,
      fileType,
    });
    yield put(FormLayoutActions.updateApplicationMetadataFulfilled());
  } catch (error) {
    yield put(FormLayoutActions.updateApplicationMetadataRejected({ error }));
  }
}

export function* watchUpdateApplicationMetadataSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.updateApplicationMetadata, updateApplicationMetadata);
}

export function* addLayoutSaga({ payload }: PayloadAction<IAddLayoutAction>): SagaIterator {
  try {
    const { layout, isReceiptPage, org, app } = payload;
    const layouts: IFormLayouts = yield select(
      (state: IAppState) => state.formDesigner.layout.layouts
    );
    const layoutOrder: string[] = yield select(
      (state: IAppState) => state.formDesigner.layout.layoutSettings.pages.order
    );
    const layoutsCopy = JSON.parse(JSON.stringify(layouts));

    if (isReceiptPage) {
      yield put(
        FormLayoutActions.updateReceiptLayoutName({
          receiptLayoutName: layout,
          org,
          app,
        })
      );
    }

    if (Object.keys(layoutsCopy).indexOf(layout) !== -1) {
      throw Error('Layout already exists');
    }
    layoutsCopy[layout] = convertFromLayoutToInternalFormat(null, false);

    yield put(
      FormLayoutActions.addLayoutFulfilled({
        layouts: layoutsCopy,
        layoutOrder: isReceiptPage ? layoutOrder : [...layoutOrder, layout],
        org,
        app,
      })
    );

    const firstPageKey = layoutOrder[0];
    const firstPage = layoutsCopy[firstPageKey];
    const hasFirstPage = Object.keys(layoutsCopy).length > 1;

    if (hasFirstPage && !isReceiptPage) {
      const navigationButtonComponent = {
        type: 'NavigationButtons',
        componentType: ComponentTypes.NavigationButtons,
        textResourceBindings: {
          next: 'next',
          back: 'back',
        },
        dataModelBindings: {},
        showBackButton: true,
      };

      if (firstPage && firstPage.components) {
        const hasNavigationButton = Object.keys(firstPage.components).some(
          (component: string) => firstPage.components[component].type === 'NavigationButtons'
        );
        if (!hasNavigationButton) {
          yield put(
            FormLayoutActions.updateSelectedLayout({ selectedLayout: firstPageKey, org, app })
          );
          yield put(
            FormLayoutActions.addFormComponent({
              component: {
                ...navigationButtonComponent,
                id: generateComponentId(navigationButtonComponent.type, layoutsCopy),
              },
              position: Object.keys(layoutsCopy[firstPageKey].components).length,
              containerId: Object.keys(layoutsCopy[firstPageKey].containers)[0],
              org,
              app,
            })
          );
        }
      }

      // Delay is added so the saga that saves the formlayout after adding the formcomponent is registered
      // and executed by the watcher before the below action is fired
      yield delay(500);
      yield put(FormLayoutActions.updateSelectedLayout({ selectedLayout: layout, org, app }));
      yield put(
        FormLayoutActions.addFormComponent({
          component: {
            ...navigationButtonComponent,
            id: generateComponentId(navigationButtonComponent.type, layoutsCopy),
          },
          position: 0,
          containerId: Object.keys(layoutsCopy[layout].containers)[0],
          org,
          app,
        })
      );
    }
  } catch (error) {
    console.error(error);
    yield put(FormLayoutActions.addLayoutRejected({ error }));
  }
}

export function* watchAddLayoutSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.addLayout, addLayoutSaga);
}

export function* updateLayoutNameSaga({
  payload,
}: PayloadAction<IUpdateLayoutNameAction>): SagaIterator {
  try {
    const { oldName, newName, org, app } = payload;
    yield call(Axios.post, formLayoutNamePath(org, app, oldName), JSON.stringify(newName), {
      headers: { 'Content-Type': 'application/json' },
    });
    yield put(FormLayoutActions.updateSelectedLayout({ selectedLayout: newName, org, app }));
    yield put(FormLayoutActions.updateLayoutNameFulfilled({ newName, oldName, org, app }));
  } catch (error) {
    yield put(FormLayoutActions.updateLayoutNameRejected({ error }));
  }
}

export function* watchUpdateLayoutNameSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.updateLayoutName, updateLayoutNameSaga);
}

export function* fetchFormLayoutSettingSaga({
  payload,
}: PayloadAction<{ org; app }>): SagaIterator {
  const { org, app } = payload;
  try {
    const settings: ILayoutSettings = yield call(get, layoutSettingsPath(org, app));
    if (settings) {
      yield put(FormLayoutActions.fetchLayoutSettingsFulfilled({ settings }));
    }
  } catch (error) {
    yield put(FormLayoutActions.fetchLayoutSettingsRejected({ error }));
  }
}

export function* watchFetchFormLayoutSettingSaga(): SagaIterator {
  yield takeEvery([FormLayoutActions.fetchLayoutSettings], fetchFormLayoutSettingSaga);
}

export function* saveFormLayoutSettingSaga({ payload }: PayloadAction<{ org; app }>): SagaIterator {
  const { org, app } = payload;
  try {
    const layoutSettings = yield select(
      (state: IAppState) => state.formDesigner.layout.layoutSettings
    );
    yield call(post, layoutSettingsPath(org, app), layoutSettings);
  } catch (err) {
    console.error(err);
  }
}

export function* watchSaveFormLayoutSettingSaga(): SagaIterator {
  yield takeLatest(
    [
      FormLayoutActions.addLayoutFulfilled,
      FormLayoutActions.deleteLayoutFulfilled,
      FormLayoutActions.updateLayoutNameFulfilled,
      FormLayoutActions.updateReceiptLayoutName,
      FormLayoutActions.updateLayoutOrder,
    ],
    saveFormLayoutSettingSaga
  );
}

export function* deleteLayoutSaga({ payload }: PayloadAction<IDeleteLayoutAction>): SagaIterator {
  try {
    const { layout, isReceiptPage, org, app } = payload;
    yield call(del, formLayoutPath(org, app, layout));

    const layoutOrder: string[] = yield select(
      (state: IAppState) => state.formDesigner.layout.layoutSettings.pages.order
    );
    const layouts: IFormLayouts = yield select(selectLayouts);
    const lastPageKey = layout === layoutOrder[0] ? layoutOrder[1] : layoutOrder[0];
    const lastPage = layouts[lastPageKey];
    const secondLastPageIsBeingDeleted = Object.keys(layouts).length === 2;

    if (secondLastPageIsBeingDeleted && !isReceiptPage) {
      const hasNavigationButton = Object.keys(layouts[lastPageKey].components).some(
        (component: string) => lastPage.components[component].type === 'NavigationButtons'
      );
      if (hasNavigationButton) {
        const navigationButtonComponent = Object.keys(lastPage.components).find(
          (component: string) => lastPage.components[component].type === 'NavigationButtons'
        );
        yield put(
          FormLayoutActions.updateSelectedLayout({ selectedLayout: lastPageKey, org, app })
        );
        const componentsToDelete = [lastPage.components[navigationButtonComponent].id];
        yield put(
          FormLayoutActions.deleteFormComponents({ components: componentsToDelete, org, app })
        );
        yield put(FormLayoutActions.updateSelectedLayout({ selectedLayout: layout, org, app }));
      }
    }
    yield put(FormLayoutActions.deleteLayoutFulfilled({ layout, layouts, org, app }));
  } catch (error) {
    yield put(FormLayoutActions.deleteLayoutRejected({ error }));
  }
}

export function* watchDeleteLayoutSaga(): SagaIterator {
  yield takeLatest(FormLayoutActions.deleteLayout, deleteLayoutSaga);
}
