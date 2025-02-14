---
layout: ../../layouts/BlogPost.astro
title: "Web Dev Sandboxes"
date: "2025-02-16"
description: "Reflections on sandboxed environments for web development"
tags: ["web development", "sandbox", "development environment"]
---

When I first started learning web development, I remember feeling overwhelmed by the sheer number of tools and technologies available. There were so many libraries, frameworks, and build tools to choose from, and it was hard to know where to start. I often found myself spending more time setting up my development environment and analyzing bundler options than actually writing code. Many students and beginners face similar challenges when getting started with web development, and this can be a significant barrier to entry. This is the main reason I created [VizHub](https://vizhub.com/), a platform that provides a sandboxed environment for creating and sharing web-based data visualizations.

## What is a Sandboxed Environment?

A sandboxed environment is a controlled and isolated space where users can experiment with code without affecting their local machine. Sandboxes are commonly used in web development to provide a safe and secure space for trying out new ideas, testing code snippets, and sharing work with others. They are particularly useful for beginners, as they allow users to focus on learning and experimentation without worrying about breaking things or causing conflicts with other software.

This space has been around for a long time. Some of the earliest platforms for this include [JSFiddle](https://jsfiddle.net/), [CodePen](https://codepen.io/), and [JS Bin](https://jsbin.com/). These platforms provide a simple and intuitive interface for writing HTML, CSS, and JavaScript code, and they offer features like live previews, external resource management, and collaboration tools. They have become popular among developers for quickly prototyping ideas, sharing code snippets, and collaborating with others. However, I was frustrated by these tools because they do not support ES6 modules, which I consider essential for modern web development.

On the other hand, there are also products I consider more "heavyweight" like [Glitch](https://glitch.com/), [CodeSandbox](https://codesandbox.io/), [Repl.it](https://repl.it/), [StackBlitz](https://stackblitz.com/), and [Playcode](https://playcode.io/). These platforms provide more advanced features like full project support, package management, and deployment options. They are great for building full-fledged applications and working on larger projects, but they can be overwhelming for beginners and casual users. I was frustrated by these because they are too complex for beginners and casual users. They also take _forever_ to load and do some insane things that bog down the browser. I'm also not a fan of the vendor lock-in play, where the super complex runtime environment is closed source.

And then there are the framework-specific platforms. These include [Observable](https://observablehq.com/) and the [P5.js Web Editor](https://editor.p5js.org/). There are also smaller framework REPLs like the [Svelte Playground](https://svelte.dev/playground/), the [Vue.js Playground](https://vuejs.org/v3/play/), and the [TypeScript Playground](https://www.typescriptlang.org/play/). These platforms are tailored to specific frameworks and libraries, and they provide specialized tools and features for working with those technologies. They are great for users who are already familiar with the framework or library, but they can be limiting for users who want to experiment with different tools and technologies.

## The VizHub Runtime

The rest of this article is a walk-through of the evolution of the VizHub runtime environment. It's gone through many iterations over the years. I'll cover the challenges I faced, the decisions I made, and the lessons I learned along the way. I hope this will be useful for others who are interested in building sandboxed environments for web development. I also hope it will lead to the "perfect" sandbox environment that I have been seeking for so long, yet to be created.

The VizHub Runtime versions are:

- V1 (2018-2019) - [source code](https://github.com/vizhub-core/vizhub-v1/blob/master/packages/ui/src/visualizationRunner/computeSrcDoc.js) - Simple iframe-based runtime for vanilla HTML, CSS, and JavaScript
- V2 (2020-2023) - [source code](https://github.com/vizhub-core/vizhub/tree/039a2d2b753558aba4b400914172c82710528a8d/runtime/src/v2Runtime) - Rollup-based runtime for ES6 modules, live reloading, and external resource management
- V3 (2024-present) - [source code](https://github.com/vizhub-core/vizhub/tree/039a2d2b753558aba4b400914172c82710528a8d/runtime/src/v3Runtime) - Rollup-based runtime with improved performance, hot reloading, ability to import CSV files, and support for importing across vizzes

# The VizHub V1 Runtime

The VizHub V1 runtime was a simple iframe-based environment that allowed users to write vanilla HTML, CSS, and JavaScript code. The code was executed in an isolated iframe, and the results were displayed in a live preview window. Users could edit the code in real-time and see the changes immediately in the preview window. The V1 runtime was designed to be lightweight and easy to use, with a focus on simplicity and speed. Here's how it came to be.

## The Lightweight Sandbox Idea

As I worked on VizHub, I developed a deep interest in the idea of a "lightweight" development environment that could be easily shared and accessed by anyone with an internet connection. I wanted to create a platform that would lower the barrier to entry for web development and make it easier for people to get started with coding. I also wanted to provide a space where users could collaborate, learn from each other, and share their work with the world. An essential ingredient of this vision was to build a lightweight sandbox that would support modern web development features like ES6 modules, live reloading, and external resource management.

An older project, [Blockbuilder](https://github.com/enjalot/blockbuilder) by Ian Johnson, was a huge inspiration for VizHub. Blockbuilder was a platform for creating and sharing D3.js examples that integrated with GitHub Gists and bl.ocks.org (a now defunct example sharing platform). In fact, I did use Blockbuilder the first year I taught my dataviz course, and the frustration that it did not support ES6 modules was a big part of what motivated me to build VizHub.

## Magic Sandbox

In fact, the core element of Blockbuilder that actually runs the code is a project called [Magic Sandbox](https://www.npmjs.com/package/magic-sandbox) that I split out of the Blockbuilder codebase. There's a great writeup of this in [Architecting a Sandbox by Ian Johnson](https://medium.com/@enjalot/architecting-a-sandbox-97b211937911). Ian points out some excellent special points about what makes it hard to build a sandbox that mimics what you would expect from a local development environment based on just a local HTTP server serving vanilla HTML, namely:

- **Security**: You don't want the code running in the sandbox to be able to access the user's cookies or local storage, or to be able to make network requests to other domains.
- **Isolation**: You don't want the code running in the sandbox to be able to access the global scope of the parent page, or to be able to interfere with other code running in the sandbox.
- **Accessing Scripts and Stylesheets**: You want the code running in the sandbox to be able to access user-defined scripts and stylesheets, but it can't do that by going to a server.
- **Loading Data**: You want the code running in the sandbox to be able to load user-defined data, but it can't do that by going to a server.

The way Magic Sandbox works is by using an iframe to create a separate browsing context for the code to run in. It also generates a standalone "HTML Bundle" that includes the user's code, scripts, stylesheets, and data. This HTML Bundle is then loaded into the iframe, and the code is executed in the isolated environment. The various files are all inlined into the HTML, and a shim for `XMLHttpRequest` (now we'd use `fetch` instead) is used to load data.

Looking through the [Magic Sandbox source code](https://github.com/vizhub-core/magic-sandbox/blob/63114c5ab7f44bd1ec27fd96308c59a8c93506fb/src/magicSandbox.js) there are all sorts of interesting and dubious hacks to make this work. For example, check out the way the files are inserted into the HTML for later reference:

```js
var filesString = encodeURIComponent(JSON.stringify(referencedFiles));
var fileNamesString = JSON.stringify(Object.keys(referencedFiles));
template =
  '<meta charset="utf-8"><script>' +
  'var __filesURI = "' +
  filesString +
  '";\n' +
  "var __files = JSON.parse(decodeURIComponent(__filesURI));\n" +
  "var __fileNames = " +
  fileNamesString +
  ";" +
  "</script>" +
  template;
```

Here's a snippet of the `XMLHttpRequest` shim that pulls from `__files`:

```js
var xmlOverride = `<script> (function() {
    var XHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      this.xhr = new XHR();
      return this;
    }
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.file = url;
        this.responseText = __files[url];
    ...
```

This is a pretty wild hack, but it works! The code runs in the sandbox, and it can load data and scripts from the user's code. It's a bit of a miracle that it works at all, but it's a testament to the power of the web platform that you can do this kind of thing. Magic Sandbox is what powers the code execution on VizHub, for the V2 runtime anyway, and it has been a critical component of the platform's success.

## Integration

Here's what the MagicSandbox integration looks like in the VizHub V2 runtime:

```js
import magicSandbox from "magic-sandbox";

const template = (files) => {
  const indexHtml = files.find((file) => file.name === "index.html");
  return indexHtml ? indexHtml.text : "";
};

const transform = (files) =>
  files
    .filter((file) => file.name !== "index.html")
    .reduce((accumulator, file) => {
      accumulator[file.name] = {
        content: file.text,
      };
      return accumulator;
    }, {});

export const computeSrcDoc = (files) =>
  magicSandbox(template(files), transform(files));
```

This gives us a mapping from a collection of user files to HTML that can be used as the `srcdoc` attribute of an iframe. In the VizHub V1 runtime, whenever the user edited the code and paused for a second or so, it triggered an automatic re-run of the code in the sandbox. This allowed users to see the results of their changes in real-time, without having to manually refresh the page, or even manually trigger a run at all (which proved problematic in fact, especially around unintended executions and infinite loops). The V1 runtime was simple and effective, but it had some limitations that I wanted to address in the next version. The biggest limitation was that it did not support ES6 modules.

# The VizHub V2 Runtime

Magic Sandbox by itself is not enough to support modern web development features like ES6 modules. To do that, we need a build tool that can bundle the user's code into a single file that can be executed in the sandbox. The VizHub V2 Runtime layers Rollup on top of the existing Magic Sandbox infrastructure to provide support for ES6 modules, live reloading, and external resource management. This allows users to write modern JavaScript code using ES6 modules and other features, and see the results in real-time in the sandbox.

## Rollup

I chose [Rollup](https://rollupjs.org/) for this task because it is a simple and efficient module bundler that supports ES6 modules out of the box, AND it works in the browser. Rollup takes the user's code, resolves the module imports, and bundles everything into a single file that can be executed in the sandbox. This allows users to write modern JavaScript code using ES6 modules and other features, and see the results in real-time in the sandbox.

Due to the elegant design of Rollup's plugin system, it's fairly straightforward to craft a plugin that provides a "virtual file system", which we can populate from user generated code. This is the key to making Rollup work in the browser, and it's what allows us to use Rollup in the VizHub V2 runtime. For this piece of the puzzle I chose to leverage the existing package [rollup-plugin-hypothetical](https://github.com/lemmabit/rollup-plugin-hypothetical).

The VizHub V2 Runtime enviromnent has a two-phase approach whenever users edit code:

- Bundle the code with Rollup, generating a file called `bundle.js`
- Run the code in Magic Sandbox

This setup makes for a somewhat awkward authoring experience, where the entry point is `index.js`, but the HTML references a file called `bundle.js`. This has actually led to a massive amount of confusion and frustration for users. The most common question I get from VizHub users is something along the lines of "I exported my code but it doesn't have `bundle.js` and doesn't run, how can I generate `bundle.js`?". This is a huge problem. They're not wrong. The platform should make it easy to export the code in a way that it can be run in a standalone environment. This is a critical piece of the puzzle that I have not yet truly solved.

The answer, though, is to add a Rollup config to the code locally that mimics that used internally by VizHub, which again is a lot to ask of users. FWIW, it looks something like this:

```js
// Use Buble for JSX support
import buble from "@rollup/plugin-buble";

export default {
  input: "index.js",
  external: ["d3"], // Treat D3 as an external dependency
  output: {
    file: "bundle.js",
    format: "iife",
    sourcemap: true,
    globals: {
      d3: "d3", // Map the 'd3' module to the global 'd3' variable
    },
  },
  plugins: [buble()],
};
```

## Supporting React JSX

At the time, React was hot. Really hot. I wanted to support React in VizHub, but it was a bit of a challenge. React uses JSX syntax, which is not natively supported by Rollup. To make it work, I had to add an additional plugin that transpiles the JSX syntax to plain JavaScript. Babel was one option, but there was a much lighter-weight alternative called [Buble](https://github.com/bublejs/buble). Buble is a fast and lightweight ES6/ES2015, ES2016, and ES2017 compiler that supports JSX syntax. It's a great fit for the VizHub V2 runtime, as it allows users to write React code using JSX syntax and see the results in real-time in the sandbox.

I did go down a rabbit hole of trying to make it even lighter-weight by removing all the non-JSX stuff from it. I created a derivative library called [buble-jsx-only](https://www.npmjs.com/package/buble-jsx-only). The premise of this library is to remove all that unnecessary code, so we end up with a minimal library that does JSX transformations. How? Forked Bublé (as of July 2021), removed all tests except those for JSX, and used Istanbul to detect which code was not covered by the tests. Manually removed each piece of code not required for JSX transforms.

Much to my surprise, the `buble-jsx-only` package has around 14K weekly downloads on NPM! That's crazy! I guess there are a lot of people out there who want a lightweight JSX transpiler.

## Handling Libraries

One of the requirements of our sandbox is that we need to be able to use **third party libraries**. For example, D3.js access is critical. Ideally we could use any NPM package! Rollup, when used in a typical local web development setup, usually bundles library code along with the user's code. However, in our browser-based sandboxed environment, that's not really practical. It's also wasteful of computational resources to re-bundle the library code every time the user makes a change. Instead, we need a way to load the library code separately from the user's code, so that it can be cached and reused across multiple executions within the sandbox.

In the excellent article [Handling 3rd-party JavaScript with Rollup](https://www.mixmax.com/engineering/rollup-externals), the authors describe how to use Rollup's `external` and `globals` options to load third-party libraries from a CDN. This approach allows the library code to be loaded separately from the user's code, and it ensures that the library is only loaded once and cached using browser-native mechanisms. This is a critical optimization for our sandbox, as it allows us to use third-party libraries like D3.js without incurring the overhead of re-bundling the library code every time the user makes a change.

That leaves us with another conundrum: how do users pull in these browser globals and configure them correctly? At first I started a project called [vizhub-libraries](https://github.com/vizhub-core/vizhub-libraries/tree/master), which is a collection of Rollup configs for various libraries. It just maps the imported package name to the browser global name. This does not solve actually pulling in the dependencies, though. The user is still responsible for actually adding the `<script>` tag to the HTML and specifying the CDN source path. This is not optimal, but it worked for the early days of VizHub.

## Faking `package.json`

To solve the problems of a.) needing to maintain a mapping from package names to browser globals and CDN and b.) the user needing to define the `<script>` tags in the HTML, support for configuration of both of those things was added using the familar construct of a `package.json` file. This file provides a familiar interface for users to specify the libraries they want to use in their code, including specific versions. The `package.json` file is parsed by the VizHub runtime, and the libraries are loaded using the specified CDN source paths and browser globals. This is a bit of a hack, but it works, and it provides a familiar interface for users to configure their dependencies.

Here's an example `package.json` file that works with the VizHub V2 Runtime. To see this in action, check out the example [Hello Package.json](https://vizhub.com/curran/161a5fcfe2e148f583cc75efb8ab3255).

**package.json**

```json
{
  "dependencies": {
    "d3": "7.8.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "vizhub": {
    "libraries": {
      "d3": {
        "global": "d3",
        "path": "/dist/d3.min.js"
      },
      "react": {
        "global": "React",
        "path": "/umd/react.production.min.js"
      },
      "react-dom": {
        "global": "ReactDOM",
        "path": "/umd/react-dom.production.min.js"
      }
    }
  }
}
```

To support usage of _any_ package with ES6 import syntax, we've added a special `vizhub.libraries` field in `package.json`. This field lets you define the mappings from package names to browser globals _yourself_. Also, since the CDN path to the browser build is sometimes not at the package root, and can be different for each package (and there's no way of knowing programmatically what it is), you can also specify what path to use.

# The VizHub V3 Runtime

After I started using [Vite](https://vite.dev/) for projects at work, I became obsessed with the idea of hot reloading. In Vite, this works out of the box, and it's called "Hot Module Replacement". This feature lets you see the results of your changes in real-time without losing the state of your application. It's a game-changer for web development, and I wanted to bring this feature to VizHub. I also wanted to add support for importing CSV files and the ability to import code across different vizzes. I also wanted to get away from the "cruft" in the V2 Runtime, specifically the dependencies of `magic-sandbox`, `rollup-plugin-hypothetical`, and `buble-jsx-only`. This led to the creation of the VizHub V3 Runtime.

## Hot Reloading

In order to achieve hot reloading, I didn't really see a clean way to do it while maintaining support for a custom HTML entry point. Also at this time I was converging on the "unidirectional data flow" pattern as a way of teaching D3 in my dataviz class in a framework-agnostic way. This led to the idea of using a single entry point for all VizHub vizzes, and using a "state" object to manage the state of the application. This state object would be passed to the viz runtime, and the viz runtime would be responsible for rendering the viz based on the state. This is a bit of a departure from the V2 Runtime, where the user's code was responsible for rendering the viz directly.

**index.js**

```js
export const main = (container, { state, setState }) => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  // Your code goes here. Sky's the limit!
};
```

The entry point that all Viz authors need to define in order to use the VizHub V3 runtime is the `main` function above. It accepts as arguments the container element, and an object with `state` and `setState` properties. The `state` object is used to manage the state of the application, and the `setState` function is used to update the state. This is a simple and effective way to manage the state of the application in a unidirectional data flow pattern. It also "unlocks" hot reloading!

The actual hot reloading is achieved by preserving the state object across re-runs of the code. This is done by listening for messages within the `iframe`. When a certain message is sent that contains a new definition of the code, the new code is executed, which defines a new version of the entry point, then that new version of the entry point is invoked with the existing state object. This allows the state to be preserved across re-runs of the code, enabling hot reloading.

## Importing from CSV Files

One neat thing we can do with Rollup is to use plugins to transform the code in various ways. One of the plugins I added to the VizHub V3 runtime is a CSV loader. This plugin allows users to import CSV files directly into their code using ES6 import syntax. The CSV files are loaded at build time and transformed into JavaScript objects, which can then be used in the code. This is a powerful feature that allows users to work with data in a more structured and efficient way.

```
import { data } from './data.csv';
```

## Importing Across Vizzes

For years I had this idea of adding the ability to import things across vizzes. This would allow users to share code between different vizzes, and it would enable a more modular and reusable approach to building vizzes. I finally got around to implementing this feature in the VizHub V3 runtime. The way it works is that you can define a "module" in one viz, and then import that module into another viz. This allows you to share code and data between different vizzes, and it enables a more modular and reusable approach to building vizzes.

One use case for this that is really nice is to define a dataset as a viz, then import that dataset into another viz to use in the visualization. This allows you to separate the data from the visualization code, which can make the code more readable and maintainable. It allows you to reuse the same dataset in multiple vizzes, which can save time and reduce duplication of code. It also support _updating the data_ in the original viz, and having those changes reflected instantly in all the vizzes that import it. This is a powerful feature that enables a more flexible and efficient approach to building vizzes.

Here's a snippet from a [scatter plot example](https://vizhub.com/curran/86b1410c5758465bb8b85835ee4f7c76?edit=files&file=index.js):

```
import { data } from '@curran/penguins';
```

Note that when importing across vizzes, hot reloading is preserved! If any of the vizzes imported from are updated, the changes are reflected in the importing viz _immmediately_. I think this is super cool and is a huge technical victory. In general the V3 Runtime feels like a huge technical victory, but the question remains: is it _too_ complex? Is it too restrictive? Is it too opinionated? Maybe some of the things it lacks, like JSX support and custom HTML entry points, are actually critical features that should be added back in. I'm not sure. I'm still figuring it out. Most of the feedback I get is that it's "cool", sure, but actually it's too complex and too hard to use.

# The VizHub V4 Runtime

The VizHub V4 Runtime does not exist yet. I think there's a great opportunity to make VizHub more relevant and useful in today's world by improving upon the runtime environment. The key to this may be to provide a more flexible and customizable environment that supports a wider range of use cases. I often look towards Vite as the gold standard for web development environments, and I think there's a lot we can model after it. In an ideal world, Vite could run in the browser and the VizHub V4 Runtime would just use it! Unfortunately, Vite cannot readily be run in the browser. Maybe the best approach would be to build a Vite-like runtime environment from scratch that is optimized for the needs of VizHub users. This is a big project, but I think it could be a game-changer for VizHub.

## What to Support?

After all this time working on it, when I turn to VizHub now, I'm frustrated by what it does not support. I'm frustrated that the different runtime versions support different things. I also kind of want to use TypeScript, since I've gotten so used to using it professionally. I also want to use React, since it's so incredibly useful for the UI that frames data visualizations. I also want to use Tailwind, since that's so common nowadays, and AI loves it. In general, if we can make VizHub more accessible to AI, I think that's the biggest win, since in the future most of the coding and iteration work will be done by AI.

I think the VizHub V4 Runtime should support:

- **Custom HTML** - Users should be able to define their own HTML entry points, and the runtime should be able to run the code in the sandbox using that entry point. This is a critical feature that was lost in the V3 Runtime, and it should be added back in. Students need to be able to start from the basics and build up from there. It's often useful to include things like Google Fonts, custom CSS, and other resources in the HTML entry point.
- **ES modules** - Table stakes
- **NPM Packages** - Users should be able to import packages from NPM and use them in their code. The previous runtime versions (V2 and V3) rely on libraries providing "browser builds" that expose browser globals. More and more so, library authors are not providing these, so we may want to strictly support only ESM builds for libraries. One very painful case is that of ThreeJS, which does not provide a browser build, so sadly cannot be used in VizHub currently. This is a huge limitation that should be addressed in the V4 Runtime.
- **JSX syntax for React** - Yes, I do still want to use React
- **TypeScript** - This might be hard to pull off, but Yes, I do want to use TypeScript. The D3 types are terrible, but I do want the ability to add types to my code. For this we may leverage learnings from [val-town/codemirror-ts](https://github.com/val-town/codemirror-ts), which provides TypeScript support for CodeMirror, and may let us [Access TypeScript Web Worker environment to Transpile Code](https://github.com/val-town/codemirror-ts/issues/58).
- **Tailwind CSS** - I think this is a great way to style the UI, and it's very popular nowadays. I think it would be a great addition to VizHub. It might be trivial to support, but IDK there's always something weird that comes up with Tailwind and build tools.
- **Hot reloading** - This is a game-changer for web development, and it should be a core feature of the VizHub V4 Runtime. It should be easy to see the results of your changes in real-time without losing the state of your application. I'm really not sure how this could play out in the general case. Maybe we could do something similar to the [Vite HMR API](https://vite.dev/guide/api-hmr).
- **CSS Files** - We need to be able too use CSS. Maybe it's as simple as concatenating all CSS files available and including them on the page. Maybe this is something solved in the HTML entry point. Or maybe we want to replicate the Vite syntax of `import './styles.css'`.
- **Using `fetch` to load data** - I like the pattern of using `fetch` (usually via `d3.csv` or `d3.json`) to load data. Maybe we could bring back that idea from Magic Sandbox of shimming `fetch` to pull from our files. I'm not sure we'd want to go so far as to embed the actual data in the `srcdoc` like Magic Sandbox does, but maybe the best approach would be to have the `fetch` proxy to the outer page, which can use `postMessage` to send the data back to the sandbox `iframe`.
- **Standalone HTML Build** - There are many advantages to being able to output a single monolithic HTML document that contains everything it needs to run. For example, we could ship off this HTML to a screenshot service like [Screenshot Genie](https://screenshotgenie.com/) to generate a thumbnail image. We could also use this HTML as a static asset to be hosted on GitHub Pages, Netlify, or elsewhere. Users could click "Export to HTML" and get a file they can double-click on their desktop and run. This is an awesome portability feature that should be added to the VizHub V4 Runtime.

Interestingly enough, some of the things that are working with the V3 Runtime are actually _not_ things I would want to commit to for the V4 Runtime:

- **Importing from CSV files** - This actually turned out pretty badly in practice performance-wise. It's cool in a way, and works OK for tiny datasets, but when the data gets even mid-sized, the performance is terrible. The editor crashes, the browser crashes, the whole thing is a mess. I think the right way to handle data is to use `fetch` and store the loaded data in local state.
- **Importing across vizzes** - This is a cool feature, but it's also a bit of a hack. It's hugely complex, and yeilds a vendor lock-in situation, which while good for business doesn't taste quite right to me. I think the right way to handle this is to use a package manager like NPM to share code between vizzes. Or maybe VizHub could just host ESM modules directly, and users could import them directly from the web. That would be cool!
- **Unidirectional data flow** - This is a cool pattern, and while I will definitely be using it for my course material, I don't think the runtime environment / platform itself should force this on users. It's a bit too opinionated. I think the right way to handle this is to let users define their own entry points, and let them manage the state of the application however they see fit. Maybe it should still be there in some form, but should be opt-in (perhaps by omitting `index.html`).

## How to Build It?

I did a lot of research on how to build a Vite-like runtime environment in the browser. Web APIs have evolved so much over the past few years, and now there are more tools and techniques available for "faking" the JavaScript imports. If we could get the ES6 imports working without relying on Rollup, that would drop our bundle size dramatically. Ideally this runtime environment could be a "real" open source project that lots of people use. As such it should be "layered", with an extremely lightweight "base layer" and then hooks to add in various additional functionality such as the TypeScript and JSX support.

I think the right way to build the VizHub V4 Runtime is to start with a simple and efficient base layer that supports ES6 modules and hot reloading. This base layer should be optimized for performance and ease of use, and it should provide a solid foundation for building more advanced features on top. Once the base layer is in place, we can add support for TypeScript, JSX, Tailwind CSS, and other features that users want. We can also add support for importing from CSS files and using `fetch` to load data. This layered approach will allow us to build a flexible and customizable runtime environment that meets the needs of a wide range of users.

### Service Workers?

I did a little experiment to see if I could get this base layer working using [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API). The idea is to use a Service Worker to intercept the ES6 module requests and load the code dynamically. This would allow us to support ES6 modules in the browser without relying on Rollup. I got it working for a simple example, but it's still a work in progress. I think this approach has a lot of potential, and I'm excited to see where it goes. Check out the demo: [vizhub-lite](https://github.com/vizhub-core/vizhub-lite).

This basically works, but it's a lot of additional overhead to manage the Service Worker, and it's not clear how to handle the hot reloading case. It also precludes the monolithic HTML build, so ultimately I don't think this is the way forward. It was fun to get working as a proof of concept, though!

### Import Maps?

Another promising API is the [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap). The import map API allows us to provide mappings between package names and CDN URLs that host ESM builds. This can replace the Rollup build + browser global approach for third party libraries. An import map can _also_ specify how to resolve "local files". This may allow us to include our JS source files embedded within the import map, and _not_ use Rollup at all for bundling! This is a very promising approach, and I think it could be the key to building the VizHub V4 Runtime. I have not done a PoC of this yet, and also with this it's not clear how to handle the hot reloading case.

# Conclusion

This article covered the history of the VizHub runtime environment, from the simple iframe-based V1 Runtime to the more advanced Rollup-based V2 and V3 Runtimes. I also outlined my vision for the VizHub V4 Runtime, which aims to provide a more flexible and customizable environment that supports a wider range of use cases. I hope this article has been useful for others who are interested in building or using sandboxed environments for web development. I think there's a lot of potential in this space, and I'm excited to see what the future holds. Thanks for reading! 🚀
