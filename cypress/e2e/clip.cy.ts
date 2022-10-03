describe('Clip', () => {
    it('Should play clip', () => {
      cy.visit('/');
      cy.get('app-clips-list > .grid a:first');
      cy.get('.video-js').click();
      cy.wait(100000);
      cy.get('.video-js').click();
      cy.get('.vjs-play-progress').invoke('width').should('gte');
    });
  });