const Fs = require("fs");
const CsvReadableStream = require("csv-reader");

let inputStream = Fs.createReadStream(
  "resources/attivita_pesca_2016_csv.csv",
  "utf8"
);

inputStream
  .pipe(
    new CsvReadableStream({
      parseNumbers: true,
      parseBooleans: true,
      trim: true,
    })
  )
  .on("data", function (row) {
    console.log("A row arrived: ", row);
  })
  .on("end", function (data) {
    console.log("No more rows!");
  });
