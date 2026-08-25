import { readFileSync } from "node:fs";
import lightningcss from "../node_modules/.pnpm/lightningcss@1.33.0/node_modules/lightningcss/node/index.js";
const { transform } = lightningcss;

const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
const rules = [];
let start = 0;
let depth = 0;
let quote = "";

for (let index = 0; index < css.length; index += 1) {
  const character = css[index];
  if (quote) {
    if (character === quote && css[index - 1] !== "\\") quote = "";
    continue;
  }
  if (character === '"' || character === "'") quote = character;
  if (character === "{") depth += 1;
  if (character === "}") {
    depth -= 1;
    if (depth === 0) {
      rules.push(css.slice(start, index + 1));
      start = index + 1;
    }
  }
}

for (let index = 0; index < rules.length; index += 1) {
  try {
    transform({ filename: "global.css", code: Buffer.from(rules[index]), minify: true });
  } catch (error) {
    console.error(`Invalid CSS rule ${index + 1}:`);
    console.error(rules[index]);
    console.error(error);
    process.exit(1);
  }
}

console.log(`Validated ${rules.length} top-level CSS rules.`);
