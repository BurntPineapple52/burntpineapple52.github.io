---
layout: post
title: Smolagents, Blogging, and the Quest for LLM Observability: Notes from the Lab
tags: [smolagents, blogging, llm, observability, aider, github]
categories: [ai, automation]
excerpt_separator: <!--more-->
---

# Smolagents, Blogging, and the Quest for LLM Observability: Notes from the Lab

Alright, buckle up nerds, because I'm diving deep into my latest obsession: automating blog creation with Smolagents! This whole thing started because I'm lazy af and manually adding context to Aider for my blog posts was cramping my style *sob*.

## The Setup: Smolagents vs. The World

I kicked things off by consulting the all-knowing Gemini 2.5 Pro (RIP free models maybe??) about Smolagents vs. the big dogs like Google's ADK or LangGraph. Turns out, Smolagents is lightweight, vendor-agnostic, and powerful enough for what I need. That's music to my ears.

I grabbed the Smolagent docs (huge shoutout to Hugging Face for the guided tour, which I promptly copy/pasted into Gemini). Then I unleashed the beast, asking for step-by-step instructions to build my blogging agents. You can check out my attempt in imp1.md.

## Smolagents in Action: Web Search and Fibonacci Shenanigans

HOLY SHID IT WORKS! I got Smolagent to run a test, and everything's firing on all cylinders. Web search? Check. Fibonacci? Check. Token usage? Acceptable (~5k input, ~500 output per two-step task). Model-wise, I'm slumming it with Qwen 2.5 7B Instruct via LiteLLM and OpenRouter (free is my favorite flavor).

Next up, I hit it with a mini "research" question: "Gimme the highest-starred LLM observability platforms." It spun its wheels for a bit (probably Qwen 7B's tiny context window), but it delivered a solid list.

## First Round of Tweaks: Modularizing the Style and Ditching the Date

Here's what I'm changing first:

*   **Modularize the style gathering:** I'm creating a writingstyle.md file to keep my writing style consistent. Why generate it every time when it's mostly static?
*   **Date Begone:** I'm removing the date from the post.md header because Jekyll scheduling is a PITA. Dealing with system time differences? No thanks.
*   **Context is King:** I'm pulling in the notes.md file for each repo. That plus the style guide should be enough for a decent first draft.
*   **Draft Decisions:** If the draft gets rejected, I'm adding an option to save it as a draft instead of just iterating.

## The Grind: Small Steps vs. Big Models

This whole process makes me think about the effort-vs-steps tradeoff. With these smaller models you might benefit from doing things iteratively because even if on average you hit X number of steps, with a larger model it might pay off more to let it rip. It becomes a question of effort / model choice.

Speaking of models...

## Power Up Time?

Maybe I'm overthinking it. Am I crippling myself with these 8B models? Should I just crank up the LLM power and go straight to Gemini Flash 2.5 or V3.1? The beauty is I can test this and see.

## Success (with Minor Hiccups)!

JESUS CHRIST, Gemini 2.0 Flash MURDERED IT first try! It's so amazing when you go from a problem plaguing you every step to suddenly hitting perfection and being able to focus on more abstract challenges.

The main issue? The date format was missing hyphens! This screams for separate steps/tools. (I still need to figure out how to make separate steps, btw.)

## The Verdict: Mid-Tier, but Promising!

After fixing the date, the blog felt...mid. Which is fine. I gave it basically no context. It made up YouTube videos (linking to the Muppets' "Bohemian Rhapsody," lol). Lesson learned: if you're using a small model, FILL THAT CONTEXT WINDOW.

On the bright side, the formatting and GitHub commit stuff WORKED. Seeing the change live was sick as hell!

## Next Steps: Observability and Context, Baby!

I've got Arize Phoenix installed to add telemetry to the agents. And I'm eyeing Upstash Context7 for even more context goodness (though I'm not sure how to integrate it with Aider just yet).

Stay tuned for more experiments! :D
