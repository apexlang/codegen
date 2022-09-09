import { ObjectMap } from "@apexlang/core/model";

export type visibility = "pub" | "pub(crate)" | "";

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
  if (useSerde(config)) {
    derive.push("serde::Serialize", "serde::Deserialize");
  }
  return `#[derive(${derive.join(",")})]`;
}

export function useSerde(config: ObjectMap<any>): boolean {
  return !!config.serde;
}

export function visibility(item: string, config: ObjectMap<any>): visibility {
  if (config.visibility) {
    if (config.visibility[item]) return _visibility(config.visibility[item]);
    return _visibility(config.visibility._all);
  }
  return _visibility("");
}

function _visibility(config: string): visibility {
  if (config.startsWith("pub")) {
    return "pub";
  } else if (config.startsWith("crate")) {
    return "pub(crate)";
  } else {
    return "";
  }
}
