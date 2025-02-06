const { $ } = require('@wdio/globals')
const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class MenuPage extends Page {
    /**
     * define selectors using getter methods
     */
    async menulist (entryname) {
        const spans = this.el('span.menu-bar__list-item-content');
        console.log("spans",spans);
// Find the one with the text content 'Elasticsearch Reindex'
const targetSpan = Array.from(spans).find(span => span.textContent.includes(entryname));
console.log("target",targetSpan);
await targetSpan.click();
    }

}

module.exports = new MenuPage();
