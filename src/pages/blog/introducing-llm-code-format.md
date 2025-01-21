---
layout: ../../layouts/BlogPost.astro
title: "Introducing llm-code-format"
date: "2025-01-22"
description: "Parsing and serialization of multiple code files in Markdown for LLMs"
---

<div style="text-align: center;">
  <img src="/images/llm-code-diagram.svg" alt="LLM to Markdown to Code" style="width: 200px; border-radius: 4px;">
</div>

I created a new JavaScript library for parsing and serialization of multiple code files in Markdown for LLMs! It's called [llm-code-format](https://github.com/curran/llm-code-format). It's [published on NPM](https://www.npmjs.com/package/llm-code-format). It's open source and permissively licensed under the MIT license. You can use it for parsing LLM output into multiple code files, and for serializing multiple code files for LLM input. It's also useful for deriving code examples from Markdown files like blog posts.

I have been exploring the idea of code generation using Large Language Models (LLMs) like ChatGPT models, Claude, and recently various low-cost LLMs on [OpenRouter](https://openrouter.ai/) like the Qwen and DeepSeek models. I started on this journey when I learned about [Aider](https://aider.chat/), a command line tool for editing code. I was inspired by the idea of using LLMs to generate code, and I wanted to explore programmatic ways of generating code.

## Extracting Code from LLM Output

When I started experimenting with LLMs, I noticed quickly that various LLMs have various "preferences" for the way they format code. I wanted a way to ask the same prompt to various LLMs, and consistently parse the responses, so each could be automatically executed without manual copy-pasting. In my experiments, I noticed that the most common format used by LLMs to express multiple code files is what I'm calling the "Bold Format", which looks like this in Markdown (I had to escape the backticks here, sorry - just imagine they are not escaped):

```markdown
**index.html**

\`\`\`html

<!DOCTYPE html>
<html>
  <head>
    <title>Hello, World</title>
  </head>
  <body>
    <h1>Hello, World</h1>
    <script src="index.js"></script>
  </body>
</html>
\`\`\`

**index.js**

\`\`\`js
console.log('Hello, World');
\`\`\`
```

When rendered from Markdown into HTML, that looks like this:

**index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello, World</title>
  </head>
  <body>
    <h1>Hello, World</h1>
    <script src="index.js"></script>
  </body>
</html>
```

**index.js**

```js
console.log("Hello, World");
```

This format is characterized by **bolded** file names followed by code fences with the content for the file. Normally, if you're using, say ChatGPT, it gives you a nice UI for copying the code content to the clipboard, but beyond that you're on your own. I wanted to automate the process of parsing this format into multiple code files, and serializing multiple code files into this format.

So `llm-code-format` was born! It's a simple JavaScript library that does just that. It's a single function that takes a string of Markdown content and returns an array of code files. Each code file has a `name` and `text` property. The `name` property is the file name, and the `text` property is the file content. After parsing the above Markdown content, the output would look like this:

```js
[
  {
    name: "index.html",
    text: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello, World</title>\n  </head>\n  <body>\n    <h1>Hello, World</h1>\n    <script src="index.js"></script>\n  </body>\n</html>\n`,
  },
  { name: "index.js", text: `console.log('Hello, World');\n` },
];
```

You can then use this in downstream workflows, like writing the files to disk:

```js
const { files } = parseMarkdownFiles(markdownString);
files.forEach(({ name, text }) => {
  fs.writeFileSync(path.join(outputDirectory, name), text);
});
```

The library also supports other formats that LLMs generate, even when instructed to use the bold format, to make parsing multiple code files from various models a breeze.

## Providing Code as Context for LLMs

Often, I want to include some "reference implementations" or existing code for the LLM to use as context. Normally, when using ChatGPT, you need to manually type the file name, open a code fence, then paste the code content from your editor into the chat UI. I wanted to automate this step as well, similar to the way Aider and other tools do. So `llm-code-format` also provides a function for serializing multiple code files into the Bold Format. You can use it like this:

```js
const markdownString = serializeMarkdownFiles([
  {
    name: "index.html",
    text: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello, World</title>\n  </head>\n  <body>\n    <h1>Hello, World</h1>\n    <script src="index.js"></script>\n  </body>\n</html>\n`,
  },
  { name: "index.js", text: `console.log('Hello, World');\n` },
]);
```

Then that `markdownString` can be pasted into the ChatGPT UI, or passed into a programmatically executed prompt, and the LLM will generate code in the context of the provided files. This is useful for generating code that fits into an existing codebase, or for generating code that is consistent with a particular style or set of patterns.

## Parsing Code from Blog Posts

In my previous post, [Getting Started with D3.js](./d3-basics), I used this "bold format" to express the code examples. I did this so that I could use `llm-code-format` to extract the runnable code examples _directly_ from the blog post. This is useful for creating code examples that are guaranteed to be always consistent with the blog post, and for generating code examples from blog posts for use in other contexts.

Here's the NodeJS code that extracts runnable example source files from Astro blog posts:

```js
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
      fs.writeFileSync(path.join(outputDirectory, name), text);
    });
  });
```

Now that's part of the build step, and Astro actually hosts the examples! I can then embed them into the blog posts using an `<iframe>`, which is super neat.

## Conclusion

I'm actually surprisingly excited about the idea of using this format to author blog posts and educational material. It harkens back to the days of "literate programming" wherein the docs are interspersed with code examples. It's a great format for human consumption when it comes to learning new concepts, and it's also a great format for machine consumption when it comes to generating code with LLMs. I'm excited to see where this goes, and I'm excited to see what other tools and workflows emerge around this format. I hope you find `llm-code-format` useful, and I'm excited to see what you build with it!
