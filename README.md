# Nelnet Vis
Visualization of student loan payment data from Nelnet

## Data
Used [Puppeteer](https://github.com/GoogleChrome/puppeteer) to log in to Nelnet.com and collect detailed payment data, broken down by date and group.

1. Create a file called `credentials.js` with the following content and fill in the appropriate login (already included in gitignore):
```
module.exports = {
  USERNAME: '',
  PASSWORD: ''
};
```
2. Execute `node puppeteer.js` to collect the payment data and save to src/data/data.json

## Rebuilding GH Pages
`npm run build`
Copy contents of /build into root and /static
