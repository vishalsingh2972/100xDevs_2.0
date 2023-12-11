// Object Methods Explanation
function objectMethods(obj) {
  console.log("Original Object:", obj);
  //console.log(typeof(obj));

  let keys = Object.keys(obj);
  console.log("After Object.keys():", keys);
  //console.log(typeof(keys));

  let values = Object.values(obj);
  console.log("After Object.values():", values);
  //console.log(typeof(values));

  let entries = Object.entries(obj);
  console.log("After Object.entries():", entries);
  //console.log(typeof(entries));

  let hasProp = obj.hasOwnProperty("property");
  //let hasProp = obj.hasOwnProperty("key2");
  console.log("After hasOwnProperty():", hasProp);

  let newObj = Object.assign({}, obj, { newProperty: "newValue" });
  console.log("After Object.assign():", newObj);
  //console.log(typeof(newObj));
}

// Example Usage for Object Methods
const sampleObject = {
  key1: "value1",
  key2: "value2",
  key3: "value3",
};

objectMethods(sampleObject);
