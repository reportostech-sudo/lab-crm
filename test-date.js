const Lib = require('nepali-date-converter');
// Handle possible default export which is common in CJS/ESM interop
const NepaliDate = Lib.default || Lib;

console.log("Testing BS Date Parsing...");
console.log("Type of NepaliDate:", typeof NepaliDate);
try {
    console.log("Is Constructor?", typeof NepaliDate === 'function');
} catch (e) { }

try {
    const year = 2082;
    const month = 10;
    const day = 18;

    console.log(`Input: ${year}-${month}-${day}`);

    // Test Constructor
    // Note: NepaliDate might throw if validation fails
    console.log(`Attempting: new NepaliDate(${year}, ${month - 1}, ${day})`);
    const bsDate = new NepaliDate(year, month - 1, day);
    console.log("BS Date Object Created:", bsDate.format('YYYY-MM-DD'));

    // Test Conversion
    const jsDate = bsDate.toJsDate();
    console.log("Converted JS Date:", jsDate.toString());

} catch (error) {
    console.error("Error during manual construction:", error);
}

try {
    // Test String Parsing
    console.log("Attempting String Parse: '2082-10-18'");
    const d = new NepaliDate("2082-10-18");
    console.log("String Parse Result:", d.format('YYYY-MM-DD'));
} catch (error) {
    console.error("Error during string parsing:", error);
}
