import { parseMarkdownFiles } from "llm-code-format";
import fs from "fs";
import path from "path";

const blogDir = "src/pages/blog";
const publicDir = "public/examples";

// Read all markdown files from blog directory
fs.readdirSync(blogDir)
  .filter((fileName) => fileName.endsWith(".md"))
  .forEach((fileName) => {
    const postName = fileName.replace(".md", "");
    const filePath = path.join(blogDir, fileName);
    const markdownString = fs.readFileSync(filePath, "utf8");

    // Use llm-code-format to extract code blocks from markdown!
    const { files } = parseMarkdownFiles(markdownString);

    if (!files.length) return;
    const outputDirectory = path.join(publicDir, postName);
    if (fs.existsSync(outputDirectory)) {
      fs.rmSync(outputDirectory, { recursive: true });
    }
    fs.mkdirSync(outputDirectory);
    files.forEach(({ name, text }) => {
      // Sometimes it gets the parsing wrong
      // and tries to use ridiculous file names
      if (text.length > 100) return;

      fs.writeFileSync(path.join(outputDirectory, name), text);
    });
  });
