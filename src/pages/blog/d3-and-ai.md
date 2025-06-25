---
layout: ../../layouts/BlogPost.astro
title: "D3.js and GenAI"
date: "2025-06-12"
description: "How artificial intelligence intersects with bespoke dataviz"
---

I had the pleasure of running an "unconference" at this year's Outlier conference in Miami. There were ten or so of us sitting around a table discussing AI and code-driven data visualization for about 5 minutes. Everyone shared their takes, and we touched upon so many angles of the topic. I'd like to take some time to write up the discussions we had, since the topic of AI and how it can be used for dataviz work is top of mind for so many data visualization practitioners.

## Where to use AI?

It's early days yet for AI in dataviz, so there is no clear or obvious concensus on what it really means to "use AI" for data visualization work. In my opinion, every step of the process of data visualizations projects is fair game for AI automation or acceleration. It's a question of which parts of the process actually "work" when AI is applied. It's still hit or miss as well; one person may have had success and another failure when attempting the same sort of thing.

Here are some of the things people at the table mentioned regarding how they use AI for data visualization work:

- **data research** - Given a topic or theme, ask GenAI to suggest data sources
- **data visualization design** - Given a small sample of data, e.g. 10 rows of CSV, ask GenAI to come up with ideas for ways of visualizing it
- **data parsing and processing** - Automate code generation for loading, parsing, and transforming data to prepare it for visualization
- **rapid prototyping** - Use GenAI to come up with a starting point / scaffolding for a first working visualization
- **incremental iteration** - Using code editing tools like Cursor or Aider to make incremental modifications and tweaks to existing code (a.k.a. "vibe coding")
- **refactoring** - Amazingly, refactoring large code files into many smaller once can be automated with GenAI
- **test generation** - Use GenAI to generate automated test suites
- **documentation generation** - Generate documentation based on code
- **learning** - Give students access to LLMs, they can ask it to explain how the code works or why it is a certain way
- **visualization evaluation** - Feeding rendered visualization images to vision models and asking them what they see (there was also a great talk about automating annotations using a similar technique)
- **content writing** - Using GenAI to create long form content that explains in words what a given visualization shows, using vision LLMs

## How to use AI?

Multiple people mentioned that they feel overwhelmed by the sheer number of GenAI tools and products available in today's market. Due to this common sentiment, I directed the group discussion towards tools. I asked everyone to share what specific tools they personally have had success with. Here's what they said:

- **ChatGPT** - The OG GenAI consumer product, specifically the O3 model is great for coding. A common workflow is to manually copy-paste code blocks between ChatGPT and an IDE like VSCode. Subscription fee.
- **Bolt.new** - Great for newcomers or non-technical users. Excellent for rapid prototyping and scaffolding new projects. Simplified interface. Subscription fee.
- **Cursor** - Professional grade automatic code editor, based on VSCode. Excellent UX. Subscription fee. Companies are increasingly subscribing to enterprise-wide Cursor, so this may be available at work!
- **Aider** - Open source command line tool for automatic code editing. Requires technical knowledge to set up. Very effective and reliable for refactoring and incremental iterations. Pairs well with OpenRouter, which has a pay-as-you-go credit-based model rather than a flat monthly fee.
- **Claude Code** - Anthropic's own command line tool for editing code using the Claude models.

My personal take is that regardless of what tool you use for code editing, the strengths and weaknesses of the specific models "shine through". Also regardless of the tool, one of the main challenges is to add the right code files into the context for the AI. I hear Cursor can automate this as well, which is amazing.

## Fear of AI

One person at the table seemed surprised that the general sentiment around use of AI for dataviz was positive. She asked if we were fearful that AI would "take over" the field, leading to lower quality and/or biased data visualizations, and ultimately "take our jobs". I was surprised how popular this take was in general at the Outlier conference. I heard many folks express anti-AI sentiment, as though the powers that be are forcing AI onto us data visualization practitioners against our will.

Folks who are fearful of AI expressed the following concerns:

- Our visualizations will end up as "AI slop"
- Data visualization designers will be replaced with AI
- Engineers will be replaced entirely with AI
- Data visualizations will lose the human creative touch
- If AI creates data visualizations, they will inherit the bias of LLMs
- Humans won't be able to stop the AI from misleading the population with visualizations

These are fascinating ideas! I want to respect these perspectives and hold space for them, but I personally do not share those same fears. While we are "heading in that direction" for number of the points above, I don't believe we will see the day when the human is no longer in the loop. I and others at the table expressed a more optimistic view.

Here are some of the optimistic points to counterbalance the concerns:

- The work that we are already doing can be accelerated dramatically
- Even if a visual starts as "AI slop", we can work with AI to incrementally improve it
- Engineers are currently being _empowered by_ AI to accomplish more in less time
- The human creative touch is _precicely_ what can be accelerated and amplified using AI
- If we proofread the work of AI for copywriting and "insight generation", we can catch the biases of LLMs and iterate the content until it's acceptable
- It's irresponsible to fully automate an AI-driven visualization creation and publication system, so realistically no one would ever do that

Among these various points, I can see a few points of fear that are genuinely valid _if_ people choose to cut corners, which may well happen in a corporate context in the name of maximizing profit and minimizing cost. For example, one might skip the proofreading step and send the AI slop to publication, risking publication of biased or misleading content. We're already seeing automated AI pipelines for social media content (one of my favorites is the Ballerina Cappuccina meme). Will we see the same one day for data visualizations? We shall see!

## AI in VizHub

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/wd6BnelMO9g?si=S8DZ5qfS5AEnCXjm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

If you want to try AI for D3.js code editing, one easy way is to try [VizHub Premium](https://vizhub.com/pricing), which has an "Edit with AI" feature built in! This code editing feature is similar to Aider, in that it can re-write the files that need to change. It's much less sophisticated than a tool like Cursor, but might be a good way to "get your feet wet" if you've never tried editing code with AI before. It's super fun and can help you get more done in less time.
