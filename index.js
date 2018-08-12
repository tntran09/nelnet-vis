const puppeteer = require('puppeteer');
const credentials = require('./credentials');
const fs = require('fs');

(async() => {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.nelnet.com/welcome');

  // Fill in #username and click #submit-username
  await page.waitForSelector('#username', {timeout: 10000});
  // Nelnet disables input until page is finished loading
  await page.waitForFunction(
    (input) => !input.disabled,
    {polling: 2000, timeout: 10000},
    await page.$('#username'));
  await page.focus('#username');
  await page.keyboard.type(credentials.USERNAME);
  await page.click('#submit-username');

  // fill in #Password and click #submit-password
  await page.waitForSelector('#Password', {timeout: 10000});
  // Nelnet disables input until username is submitted
  await page.waitForFunction(
    (input) => !input.disabled,
    {polling: 2000, timeout: 10000},
    await page.$('#Password'));
  await page.focus('#Password');
  await page.keyboard.type(credentials.PASSWORD);
  await page.click('#submit-password');

  // Go to history
  await page.waitForNavigation();
  await page.goto('https://www.nelnet.com/Payment/History');

  // Expand full history
  await page.waitForSelector('ul.pager li:nth-child(2)');
  await page.click('ul.pager li:nth-child(2)');
  // Wait for table to expand to something greater than 10
  await page.waitForSelector('tbody tr:nth-child(11)');

  // click each item and collect data
  let paymentCount = await page.$('tbody tr').length;
  // foreach row
  let paymentRecord = await page.$('tbody tr:nth-child(50) td:nth-child(1) a');
  var paymentDate = await page.$eval('tbody tr:nth-child(50) td:nth-child(1) a', element => element.innerText.trim());

  await paymentRecord.click();
  await page.waitForSelector('#payment-info')

  // Get all the rows (payment groups)
  let paymentGroups = await page.$$eval('tbody tr', async(rows) => {
    rows.pop(); // Last table row is totals

    return rows.map(tr => {
      let cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());

      return {
        paymentDate: paymentDate,
        groupName: cells[0],
        appliedToPrincipal: cells[1],
        appliedToInterest: cells[2],
        appliedToFees: cells[3]
      };
    })
  });

  console.log(paymentGroups);

  // await page.click('a.back-icon');

  // await browser.close();
})();
