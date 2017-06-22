# dynamodb-csv
Converts back and forth between Dynamodb and csv formats for easy import/export.
Useful for exporting from AWS, working in Excel rather than AWS' table editor, then importing back into AWS.

# Limitations:
Conversion to csv works best for dynamodb tables with a consistent schema across all rows.
csv column headers are determined based on the first row in your dynamodb table.
So, the first row in your dynamodb table MUST have all of the columns you want to convert.
Failure to follow this may result in data loss during conversion.

Conversion from csv to dynamodb requires the csv to have a headers row.

# command-line usage
```
node dynamodb-csv [dynamodb | csv] [input file] [output file]
```
For example, to convert dynamodb to csv:
```
node dynamodb-csv csv input_dynamo output.csv
```
Or, to convert csv to dynamodb:
```
node dynamodb-csv dynamodb input_csv.csv ouput_dynamo
```

# module usage
```
var dynamodb-csv = require('dynamodb-csv');
```
For example, to convert dynamodb to csv:
```
var input_dynamodb_text = [contents of exported dynamodb file]
dynamodb-csv.convertDynamodbToCsv(input_dynamodb_text, function (err, result) {
	if (err) {
		console.log(err);
	} else {
		console.log(result); //result will be in csv format
	}
});
```
Or, to convert csv to dynamodb:
```
var input_csv_text = [contents of some csv file]
dynamodb-csv.convertCsvToDynamodb(input_csv_text, function (err, result) {
	if (err) {
		console.log(err);
	} else {
		console.log(result); //result will be in dynamodb format
	}
});
```