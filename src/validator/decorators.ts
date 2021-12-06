import "reflect-metadata";
enum AttributeRequired {
  parameterNotRequired = "parameterNotRequired",
}
//classDecorator
//active validator for a Model
export function GenerateValidator(active: boolean = true) {
  return target => {
    Reflect.defineMetadata("generateValidator", active, target.prototype);
    return target;
  };
}

export function getValidator(target) {
  if (!target) {
    return false;
  }
  return Reflect.getMetadata("generateValidator", target.prototype) ?? false;
}
