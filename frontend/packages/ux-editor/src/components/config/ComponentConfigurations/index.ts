import { EditTextResourceBinding } from '../editModal/EditTextResourceBinding';
import { ComponentType } from '../../index';
import { Input } from './Input';

export const ComponentsConfigurations = {
  [ComponentType.Input]: {
    ComponentTag: Input,
  },
  textResourceBindings: {
    ComponentTag: EditTextResourceBinding,
  },
};
