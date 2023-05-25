import React from 'react';
import classes from './PolicyEditorStartPage.module.css';
import { Button } from '@digdir/design-system-react';
import { useNavigate } from 'react-router-dom';
import { resourceId1, resourceId3 } from 'resourceadm/data-mocks/policies';

export const PolicyEditorStartPage = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.wrapper}>
      <div className={classes.contentWrapper}>
        <h2>Hva vil du gjøre?</h2>
        <div className={classes.buttonWrapper}>
          <Button
            type='button'
            onClick={() => {
              navigate('/policyEditor', {
                state: {
                  resourceId: resourceId3,
                },
              });
            }}
          >
            Lag ny policy
          </Button>
          <Button
            type='button'
            onClick={() => {
              navigate('/policyEditor', {
                state: {
                  resourceId: resourceId1,
                },
              });
            }}
          >
            Endre policy
          </Button>
          <p>
            Valgt policy: <strong>policy1</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
