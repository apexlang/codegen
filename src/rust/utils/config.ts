import { ObjectMap } from "@apexlang/core/model";

export function deriveDirective(name: string, config: ObjectMap<any>): string {
  const derive = [];
  if (config.derive) {
    if (config.derive._all) {
      derive.push(...config.derive._all);
    }
    if (config.derive[name]) {
      derive.push(...config.derive[name]);
    }
  }
  return `#[derive(${derive.join(",")})]`;
}
