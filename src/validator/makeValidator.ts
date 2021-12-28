import { getValidator } from "./decorators";
import path from "path";
import fs from "fs";
import { validatorGenerator } from "./";
import { Sequelize } from "sequelize";

export function makeValidators(db: Sequelize) {
  const VALIDATORS_DIR = path.join(__dirname, "../../../../app/validators");

  const sequelize = {
    models: db.models
  };
  const models = sequelize.models;

  const validatorTemplate = (modelName, data) =>
    `
import Joi from "joi";
export const ${modelName}Schema: Joi.ObjectSchema = Joi.object({
${data}
});`;

  //iterates over all registered controllers in api docs
  for (const model in models) {
    const modelName = models[model].prototype.constructor.name;
    const validatorModel: boolean = getValidator(models[model]);
    //generate Base schemas of model in controller
    if (validatorModel) {
      console.log("Genarating validator for : " + modelName + ".....");
      const validatorProperties = validatorGenerator(models[model]);
      //add model requestSchema
      try {
        fs.writeFileSync(
          path.join(VALIDATORS_DIR, `${modelName}.ts`),
          validatorTemplate(modelName, validatorProperties.trim()),
          { flag: "wx" }
        );
      } catch (err) {
        console.log(
          `Validator ${modelName} already exist. Please delete it to generate a new one.`
        );
      }
    }
  }
}
