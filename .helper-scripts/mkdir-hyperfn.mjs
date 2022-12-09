import * as fs from "fs/promises";
import * as path from "path";
import * as readline from "node:readline/promises";
import { EOL } from "node:os";

const HYPERFUNCTION_DIRECTORY = path.join(
  process.cwd(),
  "api",
  "_hyperfunctions"
);
const TEMPLATE_DIRECTORY = path.join(
  process.cwd(),
  "api",
  ".templates",
  "hyperfunctions"
);

const SIMPLE_FRONTMATTER = `
---
section: hyperfunction
subsection: <AGGREGATE>()
---
`.trim();

const writeFunctionTemplates = async (
  apiName,
  { aggName, category, directory, functionType, isExperimental, version }
) => {
  try {
    const baseTemplate = await fs.readFile(
      path.join(TEMPLATE_DIRECTORY, `${functionType}.md`),
      "utf-8"
    );

    let newTemplate = baseTemplate
      .replace("<FUNCTION NAME, INCLUDING BRACKETS>", `${apiName}()`)
      .replace("<AGGREGATE NAME, INCLUDING BRACKETS>", `${aggName}()`)
      .replace("<BOOL>", isExperimental)
      .replace(
        "<LARGER CATEGORY FOR THIS FUNCTION, E.G., STATISTICAL AND REGRESSION ANALYSIS>",
        category
      );

    if (isExperimental) {
      newTemplate = newTemplate
        .replace("<VERSION WHEN EXPERIMENTAL FUNCTION INTRODUCED>", version)
        .replace(
          /\n\s*stable: <VERSION WHEN STABILIZED, REMOVE IF NOT STABLE>\r?\n/,
          "\n"
        );
    } else {
      newTemplate = newTemplate
        .replace("<VERSION WHEN STABILIZED, REMOVE IF NOT STABLE>", version)
        .replace(
          /\n\s*experimental: <VERSION WHEN EXPERIMENTAL FUNCTION INTRODUCED>\r?\n/,
          "\n"
        );
    }

    return fs.writeFile(path.join(directory, `${apiName}.md`), newTemplate);
  } catch {
    console.log(`Could not create template for ${apiName}`);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const twoStep = await rl.question(
  `Are you creating a hyperfunction group that uses the two-step aggregation pattern? (Y/n)${EOL}`
);

if (twoStep.match(/no?/i)) {
  console.log(
    "This tool only supports two-step hyperfunction groups for now. Sorry!"
  );
  process.exit();
}

const aggregate = (
  await rl.question(
    `What is the name of the aggregate function in this group? (e.g., stats_agg)${EOL}`
  )
).replace(/\(\)$/, "");
console.log(`Searching for existing directory for: ${aggregate}${EOL}`);

const existingFiles = await fs.readdir(HYPERFUNCTION_DIRECTORY);
const matchingFile = existingFiles.find((file) => file === aggregate);

if (matchingFile) {
  console.log(
    "A directory already exists for that aggregate. Add any new functions in the existing directory!"
  );
  process.exit();
}

console.log(`Directory not found. Creating directory...${EOL}`);
const aggDirectory = path.join(HYPERFUNCTION_DIRECTORY, aggregate);
await fs.mkdir(aggDirectory);

const promises = ["intro.md", "examples.md"].map((file) => {
  try {
    return fs.writeFile(
      path.join(aggDirectory, file),
      SIMPLE_FRONTMATTER.replace("<AGGREGATE>", aggregate)
    );
  } catch {
    console.log(`Could not write file ${file}`);
  }
});

const isExperimental = !(
  await rl.question(`Are these functions experimental? (Y/n)${EOL}`)
).match(/no?/i);

const version = await rl.question(
  `What version are these functions being introduced in?${EOL}`
);

const category = await rl.question(
  `What larger category do these functions belong in? (e.g., percentile approximation)${EOL}`
);

const accessors = (
  await rl.question(
    `What are all the accessors in this group? List them separated by commas${EOL}`
  )
)
  .split(",")
  .map((accessor) => accessor.trim().replace(/\(\)$/, ""))
  .filter(Boolean);

const hasRollup = !(
  await rl.question(`Does this group contain a rollup? (Y/n)${EOL}`)
).match(/no?/i);

rl.close();

console.log(`Creating templates...${EOL}`);

promises.push(
  writeFunctionTemplates(aggregate, {
    aggName: aggregate,
    category,
    directory: aggDirectory,
    functionType: "aggregate",
    isExperimental,
    version,
  })
);
accessors.forEach((accessor) =>
  promises.push(
    writeFunctionTemplates(accessor, {
      aggName: aggregate,
      category,
      directory: aggDirectory,
      functionType: "accessor",
      isExperimental,
      version,
    })
  )
);
if (hasRollup) {
  promises.push(
    writeFunctionTemplates("rollup", {
      aggName: aggregate,
      category,
      directory: aggDirectory,
      functionType: "rollup",
      isExperimental,
      version,
    })
  );
}

await Promise.all(promises);

console.log(
  `${EOL}Templates created! Fill them out and contact the docs team if you need help. Thank you. :)`
);
process.exit();
