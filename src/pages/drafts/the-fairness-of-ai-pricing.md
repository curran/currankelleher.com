---
layout: ../../layouts/BlogPost.astro
title: "The (un)Fairness of AI Pricing"
date: "2025-02-16"
description: "Reflections on AI SaaS pricing models"
tags: ["artificial intelligence", "pricing", "saas"]
---

What is the fairest way to price AI services? This is a question that has been on my mind for a while now. I have been experimenting with AI API calls for about a year now, and I have noticed that the pricing models for products built on top of such API calls can be, from a certain point of view, unfair. I'd like to look at several examples of AI pricing, at the API level and at the product level, and discuss the fairness of each.

## AI API Pricing

AI APIs typically charge per token. There are sometimes different rates for input tokens vs. output tokens, where the input token rate is generally cheaper. This seems fair, since the cost to you as the consumer of the API is probably roughly proportional to the amount of work the API backend has to do to process your request.

Interestingly, OpenAI started with an API pricing setup where your usage accumulates, then you get billed at the end of each month, like a utility bill. This is a bit like how electricity is billed, where you pay for what you use. However, OpenAI has since switched to a prepaid model, where you buy tokens in advance and use them up as you go. This is more like buying a prepaid phone card, where you pay for a certain amount of usage in advance. This seems fair, since you are paying for what you use, but you are also paying in advance, so you are not surprised by a large bill at the end of the month.

OpenRouter

## AI Product Pricing

AI SaaS products typically offer a flat monthly rate. This rate typically covers usage up to a certain limit per month, and the limit resets each month. If you exceed the limit, you are charged extra or need to upgrade to the next tier.

## Conclusion

[Try VizHub AI](https://vizhub.com/)
