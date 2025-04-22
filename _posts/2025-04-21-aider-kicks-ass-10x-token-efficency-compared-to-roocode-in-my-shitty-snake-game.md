---
layout: post
title: "aider kicks ass, 10x token efficency compared to RooCode in my shitty snake game!"
date: 2025-04-21 12:00:00 -0700
categories: [coding, ai]
tags: [aider, deepseekv3, roocode, token-efficiency] 
---

Just finished building my "Vulgar Snake" game with aider and Deepseekv3 - and the results are staggering compared to my previous experience building "Snake by Michael Bay" with RooCode and Gemini.

**Token Efficiency Breakdown:**
- **aider + Deepseekv3 (Vulgar Snake):** ~31k tokens total
- **RooCode + Gemini (Michael Bay Snake):** ~3M tokens (yes, million!)

That's nearly **100x more efficient** token usage with aider! Here's why it worked so well:

1. **Precise, focused changes** - aider only modifies what I ask for, no wasteful regenerations
2. **Minimal context needed** - Deepseekv3 understands the existing code structure with minimal prompting
3. **No boilerplate bloat** - aider keeps the code lean and focused on functionality

**Snake by Michael Bay (RooCode) features:**
- Explosions (with particle effects)
- Screen shake
- Slow motion effects
- All in just 6 clean JavaScript files

**Vulgar Snake (aider) features:**
- NSFW language and humor
- Dynamic difficulty scaling
- Minimalist design
- Even more efficient codebase

Biggest lesson? You don't need massive context windows or expensive models to build great stuff. Focused tooling + smart prompting beats brute force every time.

Check out both games here:
- [Snake by Michael Bay](/assets/games/snake-by-michael-bay/) (RooCode)
- [Vulgar Snake](/assets/games/vulgar-snake/) (aider)
