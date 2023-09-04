import { ComponentType } from 'app-shared/types/ComponentType';
import { FormItem } from '../types/FormItem';
import { FormPanelVariant } from '../types/FormComponent';
import {
  FingerButtonIcon,
  FileTextIcon,
  PaperclipIcon,
  CalendarIcon,
  ChevronDownIcon,
  TasklistIcon,
  PinIcon,
  ExclamationmarkIcon,
  MenuHamburgerIcon,
  ImageIcon,
  TabsIcon,
  TableIcon,
  CaptionsIcon,
  BulletListIcon,
  BookmarkIcon,
  ChevronDownDoubleIcon,
  ThumbUpIcon,
  LinkIcon,
  PresentationIcon
} from '@navikt/aksel-icons';
import React, { RefAttributes, SVGProps } from 'react';

export type FormItemConfig<T extends ComponentType = ComponentType> = {
  name: T;
  defaultProperties: FormItem<T>;
  icon?: React.ComponentType<SVGProps<SVGSVGElement> & { title?: string; titleId?: string }> & RefAttributes<SVGSVGElement>;
};

export type FormItemConfigs = { [T in ComponentType]: FormItemConfig<T> };

export const formItemConfigs: FormItemConfigs = {
  [ComponentType.Alert]: {
    name: ComponentType.Alert,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Alert,
      severity: 'info',
      propertyPath: 'definitions/alertComponent',
    },
    icon: ExclamationmarkIcon,
  },
  [ComponentType.Accordion]: {
    name: ComponentType.Accordion,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Accordion,
      propertyPath: 'definitions/accordionComponent',
    },
    icon: ChevronDownIcon,
  },
  [ComponentType.AccordionGroup]: {
    name: ComponentType.AccordionGroup,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.AccordionGroup,
      propertyPath: 'definitions/accordionGroupComponent',
    },
    icon: ChevronDownDoubleIcon,
  },
  [ComponentType.ActionButton]: {
    name: ComponentType.ActionButton,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.ActionButton,
    },
    icon: FingerButtonIcon,
  },
  [ComponentType.AddressComponent]: {
    name: ComponentType.AddressComponent,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.AddressComponent,
      dataModelBindings: {},
      simplified: true,
      propertyPath: 'definitions/addressComponent',
    },
    icon: PinIcon,
  },
  [ComponentType.AttachmentList]: {
    name: ComponentType.AttachmentList,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.AttachmentList,
      maxNumberOfAttachments: 1,
      minNumberOfAttachments: 0,
      propertyPath: 'definitions/attachmentListComponent',
    },
    icon: PaperclipIcon,
  },
  [ComponentType.Button]: {
    name: ComponentType.Button,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Button,
      onClickAction: () => { },
      propertyPath: 'definitions/actionButtonComponent',
    },
    icon: FingerButtonIcon,
  },
  [ComponentType.ButtonGroup]: {
    name: ComponentType.ButtonGroup,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.ButtonGroup,
      propertyPath: 'definitions/buttonGroupComponent',
    },
    icon: FingerButtonIcon,
  },
  [ComponentType.Checkboxes]: {
    name: ComponentType.Checkboxes,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Checkboxes,
      dataModelBindings: {},
      required: true,
      propertyPath: 'definitions/radioAndCheckboxComponents',
    },
    icon: BulletListIcon,
  },
  [ComponentType.Custom]: {
    name: ComponentType.Custom,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Custom,
      tagName: 'tag',
      framework: 'framework',
    },
  },
  [ComponentType.Datepicker]: {
    name: ComponentType.Datepicker,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      dataModelBindings: {},
      type: ComponentType.Datepicker,
      minDate: '1900-01-01T12:00:00.000Z',
      maxDate: '2100-01-01T12:00:00.000Z',
      timeStamp: false,
      required: true,
      propertyPath: 'definitions/datepickerComponent',
    },
    icon: CalendarIcon,
  },
  [ComponentType.Dropdown]: {
    name: ComponentType.Dropdown,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Dropdown,
      dataModelBindings: {},
      optionsId: '',
      required: true,
      propertyPath: 'definitions/selectionComponents',
    },
    icon: BulletListIcon,
  },
  [ComponentType.FileUpload]: {
    name: ComponentType.FileUpload,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.FileUpload,
      description: '',
      displayMode: 'list',
      hasCustomFileEndings: false,
      maxFileSizeInMB: 25,
      maxNumberOfAttachments: 1,
      minNumberOfAttachments: 1,
      propertyPath: 'definitions/fileUploadComponent',
    },
    icon: PaperclipIcon,
  },
  [ComponentType.FileUploadWithTag]: {
    name: ComponentType.FileUploadWithTag,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.FileUploadWithTag,
      description: '',
      displayMode: 'list',
      hasCustomFileEndings: false,
      maxFileSizeInMB: 25,
      maxNumberOfAttachments: 1,
      minNumberOfAttachments: 1,
      optionsId: '',
      propertyPath: 'definitions/fileUploadWithTagComponent',
    },
    icon: PaperclipIcon,
  },
  [ComponentType.Grid]: {
    name: ComponentType.Grid,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Grid,
      propertyPath: 'definitions/gridComponent',
      rows: [],
    },
    icon: TableIcon,
  },
  [ComponentType.Group]: {
    name: ComponentType.Group,
    defaultProperties: {
      itemType: 'CONTAINER',
      propertyPath: 'definitions/groupComponent',
    },
    icon: TabsIcon,
  },
  [ComponentType.Header]: {
    name: ComponentType.Header,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Header,
      size: 'L',
      propertyPath: 'definitions/headerComponent',
    },
    icon: BookmarkIcon,
  },
  [ComponentType.IFrame]: {
    name: ComponentType.IFrame,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.IFrame,
      sandbox: {},
    },
    icon: PresentationIcon,
  },
  [ComponentType.Image]: {
    name: ComponentType.Image,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Image,
      image: {
        src: {},
        width: '100%',
        align: 'center',
      },
      propertyPath: 'definitions/imageComponent',
    },
    icon: ImageIcon,
  },
  [ComponentType.Input]: {
    name: ComponentType.Input,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Input,
      dataModelBindings: {},
      required: true,
      propertyPath: 'definitions/inputComponent',
    },
    icon: CaptionsIcon,
  },
  [ComponentType.InstanceInformation]: {
    name: ComponentType.InstanceInformation,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.InstanceInformation,
      propertyPath: 'definitions/instanceInformationComponent',
    },
    icon: FileTextIcon,
  },
  [ComponentType.InstantiationButton]: {
    name: ComponentType.InstantiationButton,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.InstantiationButton,
    },
    icon: FingerButtonIcon,
  },
  [ComponentType.Likert]: {
    name: ComponentType.Likert,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Likert,
      dataModelBindings: {},
      propertyPath: 'definitions/radioAndCheckboxComponents',
    },
    icon: ThumbUpIcon,
  },
  [ComponentType.Link]: {
    name: ComponentType.Link,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Link,
    },
    icon: LinkIcon,
  },
  [ComponentType.List]: {
    name: ComponentType.List,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.List,
      propertyPath: 'definitions/listComponent',
    },
    icon: TasklistIcon,
  },
  [ComponentType.Map]: {
    name: ComponentType.Map,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Map,
      dataModelBindings: {},
      centerLocation: {
        latitude: 0,
        longitude: 0,
      },
      zoom: 1,
      required: true,
      propertyPath: 'definitions/mapComponent',
    },
    icon: PinIcon,
  },
  [ComponentType.MultipleSelect]: {
    name: ComponentType.MultipleSelect,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.MultipleSelect,
      dataModelBindings: {},
      optionsId: '',
      required: true,
      propertyPath: 'definitions/selectionComponents',
    },
    icon: BulletListIcon,
  },
  [ComponentType.NavigationBar]: {
    name: ComponentType.NavigationBar,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.NavigationBar,
      propertyPath: 'definitions/navigationBarComponent',
    },
    icon: MenuHamburgerIcon,
  },
  [ComponentType.NavigationButtons]: {
    name: ComponentType.NavigationButtons,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.NavigationButtons,
      onClickAction: () => { },
      propertyPath: 'definitions/navigationButtonsComponent',
    },
    icon: FingerButtonIcon,
  },
  [ComponentType.Panel]: {
    name: ComponentType.Panel,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Panel,
      variant: FormPanelVariant.Info,
      showIcon: true,
      propertyPath: 'definitions/panelComponent',
    },
    icon: FileTextIcon,
  },
  [ComponentType.Paragraph]: {
    name: ComponentType.Paragraph,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Paragraph,
    },
    icon: FileTextIcon,
  },
  [ComponentType.PrintButton]: {
    name: ComponentType.PrintButton,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.PrintButton,
    },
    icon: FingerButtonIcon,
  },
  [ComponentType.RadioButtons]: {
    name: ComponentType.RadioButtons,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.RadioButtons,
      dataModelBindings: {},
      required: true,
      propertyPath: 'definitions/radioAndCheckboxComponents',
    },
    icon: BulletListIcon,
  },
  [ComponentType.Summary]: {
    name: ComponentType.Summary,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.Summary,
      propertyPath: 'definitions/summaryComponent',
    },
    icon: FileTextIcon,
  },
  [ComponentType.TextArea]: {
    name: ComponentType.TextArea,
    defaultProperties: {
      id: '',
      itemType: 'COMPONENT',
      type: ComponentType.TextArea,
      dataModelBindings: {},
      required: true,
      propertyPath: 'definitions/textAreaComponent',
    },
    icon: CaptionsIcon,
  },
};

export const advancedItems: FormItemConfigs[ComponentType][] = [
  formItemConfigs[ComponentType.AddressComponent],
  formItemConfigs[ComponentType.AttachmentList],
  formItemConfigs[ComponentType.Group],
  formItemConfigs[ComponentType.Grid],
  formItemConfigs[ComponentType.NavigationBar],
  formItemConfigs[ComponentType.Map],
  formItemConfigs[ComponentType.ButtonGroup],
  formItemConfigs[ComponentType.Accordion],
  formItemConfigs[ComponentType.AccordionGroup],
  formItemConfigs[ComponentType.List],
];

export const schemaComponents: FormItemConfigs[ComponentType][] = [
  formItemConfigs[ComponentType.Input],
  formItemConfigs[ComponentType.TextArea],
  formItemConfigs[ComponentType.Checkboxes],
  formItemConfigs[ComponentType.RadioButtons],
  formItemConfigs[ComponentType.Dropdown],
  formItemConfigs[ComponentType.MultipleSelect],
  formItemConfigs[ComponentType.Likert],
  formItemConfigs[ComponentType.Datepicker],
  formItemConfigs[ComponentType.FileUpload],
  formItemConfigs[ComponentType.FileUploadWithTag],
  formItemConfigs[ComponentType.Button],
  formItemConfigs[ComponentType.NavigationButtons],
  formItemConfigs[ComponentType.PrintButton],
  formItemConfigs[ComponentType.InstantiationButton],
  formItemConfigs[ComponentType.ActionButton],
  formItemConfigs[ComponentType.Image],
  formItemConfigs[ComponentType.Link],
  formItemConfigs[ComponentType.IFrame],
  formItemConfigs[ComponentType.InstanceInformation],
  formItemConfigs[ComponentType.Summary],
];

export const textComponents: FormItemConfigs[ComponentType][] = [
  formItemConfigs[ComponentType.Header],
  formItemConfigs[ComponentType.Paragraph],
  formItemConfigs[ComponentType.Panel],
  formItemConfigs[ComponentType.Alert],
];

export const confOnScreenComponents: FormItemConfigs[ComponentType][] = [
  formItemConfigs[ComponentType.Header],
  formItemConfigs[ComponentType.Paragraph],
  formItemConfigs[ComponentType.AttachmentList],
  formItemConfigs[ComponentType.Image],
];
