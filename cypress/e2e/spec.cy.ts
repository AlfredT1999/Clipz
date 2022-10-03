describe('My First Test', () => {
  it('Sanity test', () => {
    cy.visit('/');
    cy.wait(100000);
    cy.contains('#header .text-3xl');
  });
});
