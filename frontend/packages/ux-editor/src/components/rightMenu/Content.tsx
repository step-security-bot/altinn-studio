import React, { useContext } from "react";
import { TextResourceEdit } from "../TextResourceEdit";
import { EditFormComponent } from "../config/EditFormComponent";
import { EditFormContainer } from "../config/EditFormContainer";
import { getCurrentEditId } from "../../selectors/textResourceSelectors";
import { useSelector } from "react-redux";
import { LayoutItemType } from "../../types/global";
import { FormContext } from "../../containers/FormContext";
import { useTranslation } from "react-i18next";

export const Content = () => {
  const { formId, form, handleUpdate, debounceSave } = useContext(FormContext);
  const editId = useSelector(getCurrentEditId);
  const { t } = useTranslation();

  if (editId) return <TextResourceEdit />;
  if (!formId || !form) return t("right_menu.content_empty");

  const isContainer = form.itemType === LayoutItemType.Container;

  return (
    <>
      {isContainer ? (
        <EditFormContainer
          editFormId={formId}
          container={form}
          handleContainerUpdate={async (updatedContainer) => {
            handleUpdate(updatedContainer);
            debounceSave();
          }}
        />
      ) : (
        <EditFormComponent
          editFormId={formId}
          component={form}
          handleComponentUpdate={async (updatedComponent) => {
            handleUpdate(updatedComponent);
            debounceSave();
          }}
        />
      )}
    </>
  );
};
