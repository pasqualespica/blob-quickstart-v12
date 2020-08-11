const { time } = require("console");

fs = require("fs");
// fs.readFile("/etc/hosts", "utf8", function (err, data) {
// fs.readFile("resources/attivita_pesca_2016_csv.csv", "utf8", function (

console.log("readFile...");

fs.readFile("resources/miofile.txt", "utf8", function (
  err,
  data
) {
  if (err) {
    return console.log(err);
  }

//   console.time("readfile");
//   console.log(data);
//   console.timeEnd("readfile");
//   console.log(data.length);

});

console.log("readFileSync...");

let dati = fs.readFileSync("resources/miofile.txt", "utf8", function (
  err,
  data
) {
  if (err) {
    return console.log(err);
  }

  return data
});

console.log(`dati : ${dati}`)
