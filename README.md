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
2. Execute `node puppeteer.js` to collect the payment data and save to src/data/data.json. Rename as necessary when adding more data sets.

## Adding more data
1. Add a JSON file of payment logs to the /data directory. Should be in the following format (already exported in this format if using Puppeteer script)
```
[
  "groups": {
    <group name>: original loan amount (Number),
    "A": 1234.56
    ...
  },
  "payments": [
    {
      "paymentDate": payment date (string),
      "groupName": <group name> (string),
      "appliedToPrincipal": (Number),
      "appliedToPrincipal": (Number),
      "appliedToFees": (Number)
    },
    ...
  ]
]
```
2. Import the data into /data/Datasets.js
```
import * as newData from './newData.json';
```

3. Add the imported data set into the aggregate set so that it will be included in the dropdown in the side menu
```
var allDatasets = {
  ...
  "newData": {
    data: newData,
    display: "My New Data Set"
  }
}
```
4. Commit

## Rebuilding GH Pages
Github Pages is set up for the master branch.
```
npm run build
```
Copy contents of /build into root and /static. Commit.
