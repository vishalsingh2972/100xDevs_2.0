function jsonMethods(jsonString) {
  console.log("Original JSON String:", jsonString);

  // Parsing JSON string to JavaScript object
  let parsedObject = JSON.parse(jsonString);
  console.log("After JSON.parse():", parsedObject);
  //console.log(typeof(parsedObject));

  // Stringifying JavaScript object to JSON string
  let jsonStringified = JSON.stringify(parsedObject);
  console.log("After JSON.stringify():", jsonStringified);
  //console.log(typeof(jsonStringified));
}

// Example Usage for JSON Methods
const sampleJSONString =
  '{"key": "value", "number": 42, "nested": {"nestedKey": "nestedValue"}}';

jsonMethods(sampleJSONString);
