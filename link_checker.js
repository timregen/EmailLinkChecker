var validUrl = require('valid-url');
var request = require('sync-request');
var status = require('statuses');
var clear = require('clear');

clear();

var urlList = [
  "http://www.google.com",
  "https://en.wikipedia.org/wiki/Uniform_Resource_Locator",
  "SomeInvalidURL",
  "http://www.google.com/facebook",
  "http:/dingdong/blah",
  // add some duplicates
  "SomeInvalidURL",
  "http://www.google.com/facebook"
];

var invalidUrls = validateUrls(urlList);
console.log('')
console.log(
  `Function returned these invalid links: ${JSON.stringify(invalidUrls, undefined, 2)}`
)
console.log('')

function validateUrls(list) {

  console.log(
    `Processing user's links: ${JSON.stringify(urlList, undefined, 2)} ... `)
  console.log('')

  // no reason to validate the same url twice
  var set = new Set(list)
  var invalidUrls = new Array();

  for (url of set) {
    var invalidReason;

    console.log(`Validating URL: ${url} ...`)

    // first see if it looks like a valid URI
    if (validUrl.isUri(url)) {
      // then hit the link and see if it's broken or something other than success
      try {
        var response = request('GET', url);
        if (response.statusCode != 200) {
          invalidReason =
            `Returned status: ${response.statusCode} ${status[response.statusCode]}`;
          console.log(`  '${url}' - ${invalidReason}`)
        }
      } catch (e) {
        invalidReason =
          `Invalid link`;
        console.log(`  '${url}' - ${invalidReason}`)
      }
    } else {
      invalidReason = "Not a valid URI";
      console.log(`  '${url}' - ${invalidReason}`)
    }

    // add to invalid list that we'll return to caller
    if (invalidReason != null) {
      invalidUrls.push({
        "url": url,
        "invalidReason": invalidReason
      });
    }

  }

  return invalidUrls;
}
