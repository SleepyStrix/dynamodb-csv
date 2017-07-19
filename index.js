function convertCsvToDynamodb(inputText, callback) {
	var inputRows = inputText.split("\n"); //build array of all input rows;
	var column_headers = inputRows[0].split(",");
	var converted_rows = [];
	inputRows.forEach(function (item, index, array) {
		if (index > 0 && item != undefined && item != "") {
			var row_values = item.split(",");
			var row = {};
			for (i = 0; i < column_headers.length; i++) {
				if (row_values == undefined || row_values[i] != "") { //ignore empty values
					row[column_headers[i]] = {
						"s": row_values[i]
					};
				}
			}
			var row_string = JSON.stringify(row);
			row_string = row_string.split("\\r").join(""); //purge excel's return characters
			converted_rows.push(row_string);
		} else {
			console.log("Skipping row: " + index);
		}
		//console.log(row);
		//console.log(item);
	});
	var converted_rows_string = converted_rows.join("\n");
	//console.log(converted_rows_string);

	callback(null, converted_rows_string);
}

function convertDynamodbToCsv(inputText, callback) {

	inputText = "[" + inputText.split("}\n{").join("},\n{") + "]"; //make dynamodb formatting into valid json
	//console.log(inputText);
	var input = JSON.parse(inputText);
	//console.log(input);
	var numberOfColumns = 0;
	var rows = [];

	//build column headers
	var column_headers = [];
	for (let j = 0; j < input.length; j++) {
		Object.keys(input[j]).forEach(function (key, index) {
			if (column_headers.indexOf(key) === -1) {
				//console.log(key);
				numberOfColumns++;
				column_headers.push(key);
			}
			//console.log(key);
		});
	}
	console.log(numberOfColumns + " columns detected");
	var column_headers_csv = column_headers.join(",");
	console.log(column_headers_csv);
	rows.push(column_headers_csv);

	//build other rows
	//iterate over all rows from the original dynamodb table
	input.forEach(function (item, index, array) {
		//console.log(item);
		var row = [];
		for (i = 0; i < numberOfColumns; i++) {
			var value = item[column_headers[i]];
			if (value) {
				row[i] = value.s || "";
			} else {
				row[i] = "";
			}
		}
		var row_csv = row.join(",");
		rows.push(row_csv);
	});
	console.log(rows.length + " rows counted, including header row");
	var output_csv = rows.join("\n");
	console.log(output_csv);
	callback(null, output_csv);
}

module.exports = {
	convertCsvToDynamodb,
	convertDynamodbToCsv
}
