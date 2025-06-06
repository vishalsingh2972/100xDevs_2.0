describe('Testing app', () => {

  //will open the browser and navigate to the given website.
  beforeEach(() => {
    cy.visit('https://app.100xdevs.com');
  });

  it('is able to log in', () => {
    cy.contains('Login').should('exist'); //Will find the text 'Login' on the page & check if it exists.
    cy.contains('Login').click(); //Next, will click on this Login button
    cy.contains('Signin to your Account').should('exist', { timeout: 10000 }); //will wait for 10 seconds and find the text 'Signin to your Account' on the page & check if it exists.
    cy.get('#email').type('harkirat.iitr@gmail.com'); //will find the input field with id 'email' and type the given email address.

    // Fill in the password field
    cy.get('#password').type('123random'); //will find the input field with id 'password' and type the given password.

    cy.get('button').eq(4).click(); //will find the 5th button on the page and click on it.

    cy.contains('View Content').should('exist', { timeout: 10000 }); //Will wait for 10 seconds and find the text 'View Content' on the page & check if it exists. With this, the test is complete.
  });
});
