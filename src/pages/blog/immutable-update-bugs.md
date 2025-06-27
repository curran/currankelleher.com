---
layout: ../../layouts/BlogPost.astro
title: "Immutable Update Bugs in D3.js"
date: "2025-06-27"
description: "Introduction to state management for interactive graphics"
---

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/RE-ZzByPXDk?si=h0w0fY2D6axSDwWW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe src="https://vizhub.com/curran/draggable-squares?mode=embed&embed=branded" width="960" height="500" scrolling="no" frameborder="no"></iframe>

https://vizhub.com/curran/draggable-squares

One of the great strengths of D3.js is its flexibility. It lets you build highly customized interactions, giving you low-level control over events and rendering without enforcing a particular state management approach. While this freedom is beneficial, it also means you'll sometimes encounter subtle challenges in managing state effectively.

In this article, I'll walk you through a common but subtle issue: losing the "selected" state when dragging items. I'll explain why this happens, and how to resolve it elegantly using my preferred approach—unidirectional data flow.

## What's the Issue?

Imagine you have draggable squares that can also be clicked to select them. Clicking works as expected, highlighting the selected square. Dragging unselected squares works fine too. But a tricky bug appears when you drag the already selected square—it unexpectedly becomes unselected.

This happens because the selected state relies on object reference equality. When you update positions using immutable update patterns (which create new objects instead of mutating existing ones), the original reference is lost. Thus, the reference-based equality check fails.

## Two Potential Solutions

There are two ways to fix this:

1. **Mutate the original objects** (not ideal).
2. **Track selection by unique identifiers** rather than object references (recommended).

### Why Not Mutate?

Mutating objects directly would preserve object reference equality and resolve the immediate issue. However, this introduces risks: mutable state often leads to subtle, hard-to-debug bugs in complex applications.

### The Recommended Solution: Track by ID

A better approach is to track the selection state using unique identifiers (IDs). This allows you to preserve immutability while accurately tracking the selected element.

Here's the general idea:

- Assign a unique ID to each item.
- When an item is selected, store its ID rather than the object itself.
- When checking if an item is selected, compare its ID against the stored selected ID.

By using IDs, even if objects are replaced during immutable updates, your selected state remains consistent and predictable.

## Implementing the ID-Based Selection

To implement this approach, you need to:

- Ensure each item has a unique ID.
- Update your state management to store `selectedId` rather than `selectedDatum`.
- Replace any object-reference equality checks with ID-based equality checks.

This adjustment provides a stable and robust way to handle selection states, particularly when using immutable updates.

## Conclusion

In interactive data visualization, managing state effectively is crucial. Tracking selection by ID rather than object reference strikes a great balance, preserving immutability and avoiding subtle bugs. It's an approach I strongly recommend.

I hope you found this helpful and look forward to exploring more interaction techniques in future articles!
