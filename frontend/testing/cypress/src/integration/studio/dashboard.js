/// <reference types="cypress" />
/// <reference types="../../support" />

import * as texts from '@altinn-studio/language/src/nb.json';
import { header } from '../../selectors/header';
import { dashboard } from '../../selectors/dashboard';
import { common } from '../../selectors/common';

context('Dashboard', () => {
  before(() => {
    cy.deleteAllApps(Cypress.env('autoTestUser'), Cypress.env('accessToken'));
    cy.studioLogin(Cypress.env('autoTestUser'), Cypress.env('autoTestUserPwd'));
    cy.createApp(Cypress.env('autoTestUser'), 'auto-app');
    cy.createApp(Cypress.env('autoTestUser'), 'test-app');
  });

  beforeEach(() => {
    cy.visit('/dashboard');
    cy.switchSelectedContext('self');
    cy.intercept('GET', '**/repos/search**').as('fetchApps');
    dashboard.getSearchReposField().should('be.visible');
    cy.wait('@fetchApps').its('response.statusCode').should('eq', 200);
  });

  after(() => {
    cy.deleteAllApps(Cypress.env('autoTestUser'), Cypress.env('accessToken'));
  });

  it('does not have broken links', () => {
    cy.findAllByRole('link').each((link) => {
      if (link.prop('href'))
        cy.request({
          url: link.prop('href'),
          failOnStatusCode: true,
        });
      cy.log(link.prop('href'));
    });
  });

  it('is possible to view apps, and add and remove favourites', () => {
    const createdBy = Cypress.env('autoTestUser');

    // View apps and add favourite
    cy.intercept('PUT', '**/designer/api/user/starred/**').as('addFavourite');
    dashboard.getUserAppsList().then((apps) => {
      const rows = cy.get(apps).findAllByRole('row');
      rows.should('have.length.gt', 1);
      rows
        .eq(1) // Pick the first row after the header row
        .then((row) => {
          cy.get(row).findByLabelText(texts['dashboard.star']).click();
          common
            .getCellByColumnHeader(apps, row, texts['dashboard.name'])
            .invoke('text')
            .should('not.be.empty');
          common
            .getCellByColumnHeader(apps, row, texts['dashboard.created_by'])
            .should('have.text', createdBy);
          common
            .getCellByColumnHeader(apps, row, texts['dashboard.last_modified'])
            .invoke('text')
            .should('not.be.empty');
        });
    });
    cy.wait('@addFavourite').its('response.statusCode').should('eq', 204);

    // Remove app from favourites
    cy.intercept('DELETE', '**/designer/api/user/starred/**').as('removeFavourite');
    dashboard.getFavourites().then((favourites) => {
      const rows = cy.get(favourites).findAllByRole('row');
      rows.should('have.lengthOf', 2); // Header row + 1 favourite
      cy.get(favourites).findByLabelText(texts['dashboard.unstar']).click();
    });
    cy.wait('@removeFavourite').its('response.statusCode').should('eq', 204);
  });

  it('is possible to change context and view all apps', () => {
    cy.visit('/dashboard');
    header.getAvatar().should('be.visible').click();
    header.getMenuItemAll().should('be.visible').click();
    cy.wait('@fetchApps');
    dashboard.getAllAppsHeader().should('be.visible');
  });

  it('is possible to change context and view only Testdepartementet apps', () => {
    cy.visit('/dashboard');
    header.getAvatar().should('be.visible').click();
    header.getMenuItemOrg(Cypress.env('orgUserName')).should('be.visible').click();
    cy.wait('@fetchApps');
    dashboard.getOrgAppsHeader(Cypress.env('orgFullName')).should('be.visible');
  });

  it('is possible to search an app by name', () => {
    dashboard.getSearchReposField().type('auto');
    cy.wait('@fetchApps');
    dashboard.getSearchResults().then((searchResults) => {
      cy.get(searchResults).should('have.length.gte', 1);
      cy.get(searchResults)
        .first()
        .then((app) => {
          common
            .getCellByColumnHeader(searchResults, app, texts['dashboard.name'])
            .should('contain.text', 'auto');
        });
    });
  });

  it('is possible to sort apps by last changed date', () => {
    cy.visit('/dashboard');
    // First click will put oldest application first
    dashboard
      .getUserAppsList()
      .findByRole('columnheader', { name: texts['dashboard.last_modified'] })
      .click();
    cy.wait('@fetchApps');
    dashboard.getUserAppsList().then((apps) => {
      cy.get(apps).should('have.length.gte', 1);
      cy.get(apps)
        .first()
        .then((app) => {
          common
            .getCellByColumnHeader(apps, app, texts['dashboard.name'])
            .invoke('text')
            .should('eq', 'auto-app');
        });
    });

    // Second click will put newest application first
    dashboard
      .getUserAppsList()
      .findByRole('columnheader', { name: texts['dashboard.last_modified'] })
      .click();
    cy.wait('@fetchApps');
    dashboard.getUserAppsList().then((apps) => {
      cy.get(apps).should('have.length.gte', 1);
      cy.get(apps)
        .first()
        .then((app) => {
          common
            .getCellByColumnHeader(apps, app, texts['dashboard.name'])
            .invoke('text')
            .should('eq', 'test-app');
        });
    });
  });

  it('is not possible to find an app that does not exist', () => {
    dashboard.getSearchReposField().type('cannotfindapp');
    cy.wait('@fetchApps');
    dashboard.getSearchResults().then((searchResults) => {
      cy.get(searchResults).findByRole('cell').should('have.length', 0);
      cy.get(searchResults).should('contain.text', texts['dashboard.no_repos_result']);
    });
  });

  it('is possible to open repository of an app from dashboard', () => {
    dashboard
      .getUserAppsList()
      .findByRole('cell', { name: 'auto-app' })
      .siblings("div[data-field='links']")
      .findByRole('menuitem', { name: texts['dashboard.repository'] })
      .click();
    cy.get('.repo-header').should('be.visible');
    cy.get('.repo-header').should('contain.text', Cypress.env('autoTestUser'));
    cy.get('.repo-header').should('contain.text', 'auto-app');
    cy.get('img[alt="Altinn logo"]').should('be.visible');
  });

  after(() => {
    cy.deleteAllApps(Cypress.env('autoTestUser'), Cypress.env('accessToken'));
  });
});
