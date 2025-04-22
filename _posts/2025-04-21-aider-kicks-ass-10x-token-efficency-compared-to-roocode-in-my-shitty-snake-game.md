---
layout: post
title: "aider kicks ass, 10x token efficency compared to RooCode in my shitty snake game!"
date: 2025-04-21 12:00:00 -0700
categories: [coding, ai]
tags: [aider, deepseekv3, roocode, token-efficiency] 
---

Just finished building my "Snake by Michael Bay" game with aider and Deepseekv3 - and the results are staggering compared to my previous experience with RooCode and Gemini.

**Token Efficiency Breakdown:**
- **aider + Deepseekv3:** ~31k tokens total
- **RooCode + Gemini:** ~3M tokens (yes, million!)

That's nearly **100x more efficient** token usage with aider! Here's why it worked so well:

1. **Precise, focused changes** - aider only modifies what I ask for, no wasteful regenerations
2. **Minimal context needed** - Deepseekv3 understands the existing code structure with minimal prompting
3. **No boilerplate bloat** - aider keeps the code lean and focused on functionality

The game itself has all the Michael Bay flair you'd expect:
- Explosions (with particle effects)
- Screen shake
- Slow motion effects
- All in just 6 clean JavaScript files

Biggest lesson? You don't need massive context windows or expensive models to build great stuff. Focused tooling + smart prompting beats brute force every time.

Check out the game here: [Snake by Michael Bay](/assets/games/snake-by-michael-bay/)
