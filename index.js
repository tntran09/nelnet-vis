const puppeteer = require('puppeteer');

(async() => {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.nelnet.com/welcome');

  // fill in #username and click #submit-username
  await page.waitForSelector('#username', {timeout: 10000});
  let usernameField = await page.$('#username');
  await page.waitForFunction(function(input) {
    return !input.disabled;
  }, {polling: 2000, timeout: 10000}, usernameField);
  await page.focus('#username');
  await page.keyboard.type('');
  await page.click('#submit-username');

  // fill in #Password and click #submit-password
  await page.waitForSelector('#Password', {timeout: 10000});
  let passwordField = await page.$('#Password');
  await page.waitForFunction(function(input) {
    return !input.disabled;
  }, {polling: 2000, timeout: 10000}, passwordField);
  await page.focus('#Password');
  await page.keyboard.type('');
  await page.click('#submit-password');

  // go to history
  await page.waitForNavigation();
  await page.goto('https://www.nelnet.com/Payment/History');

  // expand full history
  await page.waitForSelector('ul.pager li:nth-child(2)');
  await page.click('ul.pager li:nth-child(2)');

  // click each item and collect data
  let paymentCount = await page.$('tr').length;
  let paymentRecord = await page.$('tr:nth-child(50) td:nth-child(1) a');

  // paymentRecord is null
  await paymentRecord.click();

  // let paymentDate = await page.$eval('#payment-info form .row .row:nth-child(1) .col-xs-5', element => element.innerText);
  // console.log(paymentDate);
  // let paymentDetailsTable = page.$('table');


  await page.click('a.back-icon');

  // await browser.close();
})();
