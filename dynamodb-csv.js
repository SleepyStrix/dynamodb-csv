var fs = require('fs');
//var dyncsv = require('dynamodb-csv');
var dyncsv = require('./index.js');
if (!dyncsv) {
	dyncsv = require('dynamodb-csv');
}

var output_type = process.argv[2];
var inputPath = process.argv[3];
var outputPath = process.argv[4];
var columns = process.argv[5];

if (output_type == "csv") {
	var inputText = fs.readFileSync(inputPath, 'ascii');
	dyncsv.convertDynamodbToCsv(inputText, function (err, result) {
		//write output to file
		fs.writeFile(outputPath, result, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log("conversion from dynamodb to csv complete");
			}
		});
	});
} else if (output_type == 'dynamodb') {
	var inputText = fs.readFileSync(inputPath, 'ascii');
	dyncsv.convertCsvToDynamodb(inputText, function (err, result) {
		fs.writeFile(outputPath, result, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log("conversion from csv to dynamodb complete");
			}
		});
	});
} else {
	console.log("Specify output. Either 'csv' or 'dynamodb'");
}
