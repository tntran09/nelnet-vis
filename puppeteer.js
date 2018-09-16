const puppeteer = require('puppeteer');
const credentials = require('./credentials');
const fs = require('fs');

(async() => {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.nelnet.com/welcome');

  // Fill in #username and click #submit-username
  // Nelnet disables input until page is finished loading
  await page.waitForSelector('#username', {timeout: 10000});
  await page.waitForFunction(
    (input) => !input.disabled,
    {polling: 2000, timeout: 10000},
    await page.$('#username'));
  await page.focus('#username');
  await page.keyboard.type(credentials.USERNAME);
  await page.click('#submit-username');

  // fill in #Password and click #submit-password
  // Nelnet disables input until username is submitted
  await page.waitForSelector('#Password', {timeout: 10000});
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
  let allPayments = [];
  let paymentCount = (await page.$$('tbody tr')).length - 1; // Last row is totals
  console.log(paymentCount + ' payment count');

  for(let i = 1; i <= paymentCount; i++) {
    let paymentRecord = await page.$('tbody tr:nth-child(' + i + ') td:nth-child(1) a');
    let paymentDate = await page.$eval('tbody tr:nth-child(' + i + ') td:nth-child(1) a', element => element.innerText.trim());

    await paymentRecord.click();
    await page.waitForSelector('#payment-info')

    // Get all the rows (payment groups)
    let paymentGroups = await page.$$eval('tbody tr', async(rows, paymentDate) => {
      rows.pop(); // Last table row is totals

      return rows.map(tr => {
        let cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());

        // Assuming all payments are under $1000 which avoids trying to parse commas in numbers
        return {
          paymentDate: paymentDate,
          groupName: cells[0],
          appliedToPrincipal: Number(cells[2].substring(1)),
          appliedToInterest: Number(cells[3].substring(1)),
          appliedToFees: Number(cells[4].substring(1))
        };
      });
    }, paymentDate);

    allPayments = allPayments.concat(paymentGroups);

    await page.click('a.back-icon');
  }

  if (allPayments.length > 0) {
    // Manually filled in original loan amounts
    const data = {
      groups: {
       A: 2298.86,
       B: 2835,
       C: 4749,
       D: 3075
      },
      payments: allPayments
    };

    fs.writeFileSync('data.json', JSON.stringify(data, null, 1));
  };

  await browser.close();
})();
