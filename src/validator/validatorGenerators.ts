import { isEmpty } from "lodash";

export function validatorGenerator(model: any) {
  const attributes = model.rawAttributes;
  const modelInstance = new model();
  let validation = "";
  const body = (attribute, validation) => `${attribute}: ${validation},\n`;
  Object.keys(attributes).forEach(attribute => {
    //not part of schema
    if (
      attribute == "id" ||
      attribute == "createdAt" ||
      attribute == "updatedAt"
    ) {
      return;
    }

    let type = attributes[attribute].type.constructor.name.toLowerCase();
    validation = isEmpty(type)
      ? validation
      : validation.concat(
          body(attribute, formatAttribute(type, attribute, attributes)),
        );
  });

  return validation;
}

function formatAttribute(type, attribute, attributes) {
  switch (type) {
    case "enum":
      return `Joi.string().valid(${attributes[attribute].type.values})`;
      break;
    case "date":
      return "Joi.date().iso().options({ convert: true })";
      break;
    case "string":
      return "Joi.string().max(255)";
      break;
    case "integer":
      return "Joi.number()";
      break;
    case "float":
      return "Joi.number()";
      break;
    case "array":
      return "Joi.array()";
    default:
      return "";
      break;
  }
}
