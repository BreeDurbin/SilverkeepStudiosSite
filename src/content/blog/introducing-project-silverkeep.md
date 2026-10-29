---
title: Introducing Project Silverkeep
description: What we're building, what we care about, and where to follow along.
pubDate: 2026-10-29
---

Welcome to the first devlog for **Project Silverkeep**, a fantasy role-playing game we're building in Unreal Engine.

This post is a short introduction: what the game is, the ideas behind it, and what you'll find on this site.

## The short version

Project Silverkeep is a role-playing game built on the 3.5 edition System Reference Document rules. You can play alone, host friends, or run a persistent world on a dedicated server. And you can build worlds of your own, with the same toolset and scripting tools we use.

It's influenced by the classic toolset-driven RPGs and the tabletop games they grew from, but it's very much its own game.

## What we care about

**Your choices drive the story.** We don't gate the story with invulnerable fences or unkillable characters. If you kill the one person who knew the way forward, the world doesn't stop you: search their room and you might find the letter, the map or the key that opens another path. The story should come out of what you do, not a path we laid down in advance.

**The rules are the rules.** Combat and skills are crunchy and by the numbers. Quests have non-obvious answers that come from the rules themselves: pick the pocket that holds the key, slip past a fight unseen, or talk your way out of it.

**As deep as you want to dive.** The world has a lot of history, and it's there for players who go looking, in books, conversations and forgotten corners. We won't stop the game to lecture you about it, and every cinematic can be skipped.

**Cities under guild rule.** Nothing works without the guilds: they train craftsmen, run supply chains and fund public works. And everything is worse because of them: they fix prices, crush rivals and keep the city watch on their payroll. You should feel them in a city's streets long before you meet a guild member.

## Built to be modded

Building worlds is central to the game, not an afterthought. Game data (classes, races, feats, factions, creatures) lives in plain TOML files, and creatures run scripts written in [AngelScript](https://www.angelcode.com/angelscript/), an open-source scripting language by Andreas Jönsson. Silverscript is Project Silverkeep's scripting API for AngelScript: the objects and functions those scripts use to reach the game.

The [documentation](../../docs/) is already up. It covers the Silverscript API and every data format, generated from the game itself so it stays in step with each build.

## What's next

We'll post here as the game takes shape: systems as they come together, design decisions and the reasons behind them, and tools for building your own content. Thanks for reading.
