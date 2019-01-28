const puppeteer = require('puppeteer');
const credentials = require('./credentials');
const fs = require('fs');

(async() => {
  let groups = {};
  let allPayments = [];
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.nelnet.com/welcome');

  await Login();
  await NavigateToHistory();
  await CollectPayments();
  await CollectPrincipalLoans();

async function Login() {
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

  await page.waitForNavigation();
}

async function NavigateToHistory() {
  // Go to history
  await page.goto('https://www.nelnet.com/Payment/History');

  // Expand full history
  await page.waitForSelector('ul.pager li:nth-child(2)');
  await page.click('ul.pager li:nth-child(2)');
  // Wait for table to expand to something greater than 10
  await page.waitForSelector('tbody tr:nth-child(11)');
}

async function CollectPayments() {
  // click each item and collect data
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
}

async function CollectPrincipalLoans() {
  // Go to Loan Summary
  await page.goto('https://www.nelnet.com/Docs/Index?LoanSummary');

  await page.waitForSelector('div[ng-show*=EdLoans]', {timeout: 10000});
  let edLoansTable = await page.$('div.table-responsive[ng-show*=EdLoans] tbody');
  groups = await edLoansTable.$$eval('tr', (rows) => {
    // First row is table headers
    rows.shift();

    return rows.reduce((groups, tr) => {
      let cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
      groups[cells[0]] = Number(cells[4].substring(1).replace(',', ''));

      return groups;
    }, { });
  });
}

  if (allPayments.length > 0) {
    // Reverse the payments as they were collected in Most Recent order
    allPayments.reverse();
    // Manually filled in original loan amounts
    const data = {
      groups: groups,
      payments: allPayments
    };

    fs.writeFileSync('src/data/data.json', JSON.stringify(data, null, 1));
  };

  await browser.close();
})();
