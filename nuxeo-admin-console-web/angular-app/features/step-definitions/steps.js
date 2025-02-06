const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $ } = require('@wdio/globals')

const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/menu.page');
const MenuPage = require('../pageobjects/menu.page.js');

const pages = {
    login: LoginPage
}

Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open()
});

When('I login with {string} and {string}', async (username, password) => {
    await LoginPage.login(username, password)
});
When('I logout successfully', async () => {
    await LoginPage.logout();
});
When('I select {string} menu entry', async (entryname) => {
    await MenuPage.menulist(entryname);
});
