import "reflect-metadata";
enum AttributeRequired {
  parameterNotRequired = "parameterNotRequired",
}
//classDecorator
//active validator for a Model
export function Validator(active: boolean = true) {
  return target => {
    Reflect.defineMetadata("validator", active, target.prototype);
    return target;
  };
}

export function getValidator(target) {
  if (!target) {
    return false;
  }
  return Reflect.getMetadata("validator", target.prototype) ?? false;
}
