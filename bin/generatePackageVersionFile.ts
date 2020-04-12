import path from "path";
import fs from "fs";

const { version } = require("../package.json");
const outFile = path.join(__dirname, "../src/packageVersion.generated.ts");
fs.writeFileSync(outFile, "export default " + JSON.stringify(version) + ";\n");
