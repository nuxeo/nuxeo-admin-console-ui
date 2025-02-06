import { Given, When, Then } from '@cucumber/cucumber';
import { expect, $ } from '@wdio/globals'

Given(/^I am on the login page$/, async () => {
    await browser.url(`https://ui-2023-test.beta.nuxeocloud.com/nuxeo/nuxeoadmin`);
});

When('I login with {string} and {string}', async (username, password) => {
    await $('#username').setValue(username);
    await $('#password').setValue(password);
    await $('button[type="submit"]').click();
});

Then(/^I should see a flash message saying (.*)$/, async (message) => {
    await expect($('#flash')).toBeExisting();
    await expect($('#flash')).toHaveTextContaining(message);
});

