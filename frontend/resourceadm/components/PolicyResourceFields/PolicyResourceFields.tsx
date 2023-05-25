import React from 'react';
import classes from './PolicyResourceFields.module.css';
import { Button, TextField } from '@digdir/design-system-react';
import { MultiplyIcon } from '@navikt/aksel-icons';

interface Props {
  isEditable: boolean;
  onRemove: () => void;
  valueId: string;
  onChangeId: (s: string) => void;
  valueType: string;
  onChangeType: (s: string) => void;
}

export const PolicyResourceFields = ({
  isEditable,
  onRemove,
  valueId,
  valueType,
  onChangeId,
  onChangeType,
}: Props) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.inputWrapper}>
        <div className={classes.textfieldWrapper}>
          <TextField
            placeholder='Type'
            value={valueType}
            onChange={(e) => onChangeType(e.target.value)}
            disabled={!isEditable}
          />
        </div>
        <div className={classes.textfieldWrapper}>
          <TextField
            placeholder='Id'
            value={valueId}
            onChange={(e) => onChangeId(e.target.value)}
            disabled={!isEditable}
          />
        </div>
      </div>
      <div>
        <Button
          variant='quiet'
          icon={<MultiplyIcon title='Fjern ressursen' />} // TODO - any specific color??
          disabled={!isEditable}
          onClick={onRemove}
        />
      </div>
    </div>
  );
};
