var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const converter = require('json-2-csv');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use(express.static('./public'));

const JSONContents = fs.readFileSync('myjson.json');
const JSONasPOJO = JSON.parse(JSONContents);
console.log(JSONasPOJO);
const cvsstring = JSONasPOJO.rows.join('\n');

fs.writeFile('name2.csv', cvsstring, err => {
    if (err) return console.error(err);
    console.log('FILE SUCCESSFULLY WRITTEN!');
});

let myObj = {
  "rows": [
    {
      value1: "New Visitor",
      value2: "(not set)",
      value3: "(not set)",
      value4: "0"
    },
    {
      value1: "New Visitor2",
      value2: "(not set2",
      value3: "(not set)2",
      value4: "mobile2"
    },
    {
      value1: "New Visitor3",
      value2: "(not set)3",
      value3: "(not set)3",
      value4: "mobil3e"
    },
    {
      value1: "New Visitor4",
      value2: "(not set4)",
      value3: "(not set)4",
      value4: "mobil4e",
    }
  ]
}

let json2csvCallback = function (err, csv) {
    if (err) throw err;
    fs.writeFile('name.csv', csv, 'utf8', function(err) {
      if (err) {
        console.log('Some error occured - file either not saved or corrupted file saved.');
      } else {
        console.log('It\'s saved!');
      }
    });
};

converter.json2csv(myObj.rows, json2csvCallback, {
  prependHeader: false      // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
});


app.get('/', function(req, res)
{
	res.sendFile(__dirname + '/page.html');
});


app.listen(3000);
