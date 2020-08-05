var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const excelToJson = require('convert-excel-to-json');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use(express.static('./public'));

const result = excelToJson({
    sourceFile: 'sheet.xlsx'
});

const result2 = excelToJson({
    source: fs.readFileSync('sheet.xlsx') // fs.readFileSync return a Buffer
});

console.log(result);
console.log(result2);

app.get('/', function(req, res)
{
	res.sendFile(__dirname + '/page.html');
});


app.listen(3000);
