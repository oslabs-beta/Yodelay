/**
 * Build a JSON request body from a parsed field tree.
 * The result is always valid JSON.
 * @param {Array<{name: string, type: string, repeated?: boolean, fields?: any[], enumValues?: string[]}>} fields
 * @returns {string}
 */
function scaffoldMessage(fields) {
  const value = {};
  for (const field of fields || []) {
    value[field.name] = sampleForField(field);
  }
  return JSON.stringify(value, null, 2);
}

function sampleForField(field) {
  const sample = sampleValue(field);
  return field.repeated ? [sample] : sample;
}

function sampleValue(field) {
  switch (field.type) {
    case "TYPE_STRING":
      return "Hello";
    case "TYPE_BOOL":
      return false;
    case "TYPE_FLOAT":
    case "TYPE_DOUBLE":
      return 0;
    case "TYPE_BYTES":
      return "";
    case "TYPE_ENUM":
      return (field.enumValues && field.enumValues[0]) || "ENUM";
    case "TYPE_MESSAGE": {
      const nested = {};
      for (const child of field.fields || []) {
        nested[child.name] = sampleForField(child);
      }
      return nested;
    }
    default:
      return 0;
  }
}

export { scaffoldMessage };
