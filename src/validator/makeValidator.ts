import { getValidator } from "./decorators";
import path from "path";
import fs from "fs";

import { validatorGenerator } from "./validatorGenerators";

export function createValidator(){
  const VALIDATORS_DIR = path.join(__dirname, "../../../../app/validators");

  const importedCtrls1 = require("require-dir-all")("../../../../dist/controllers/v1");
  const controllers = Object.keys(importedCtrls1).map(k => {
    return importedCtrls1[k].default;
  });

  const validatorTemplate = (modelName, data) =>
    `
import Joi from "joi";
export const ${modelName}Schema: Joi.ObjectSchema = Joi.object({
${data}
});`;

//iterates over all registered controllers in api docs
  for (const controller of controllers) {
    const model = controller?.model;
    const modelName = model?.name ?? controller.name;
    const validatorModel: boolean = getValidator(model);
    //generate Base schemas of model in controller
    if (validatorModel) {
      console.log("Genarating validator for : " + modelName + ".....");
      const validatorProperties = validatorGenerator(model);
      //add model requestSchema
      try {
        fs.writeFileSync(
          path.join(VALIDATORS_DIR, `${modelName}.ts`),
          validatorTemplate(modelName, validatorProperties.trim()),
          { flag: "wx" },
        );
      } catch (err) {
        console.log(
          `Validator ${modelName} already exist. Please delete it to generate a new one.`,
        );
      }
    }
  }
}
