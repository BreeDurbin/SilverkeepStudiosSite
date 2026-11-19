---
title: Documentation
description: Guides and reference for scripting and modding Project Silverkeep.
template: splash
---

Project Silverkeep is built to be modded. Game rules and content live in data files you can edit, and creatures run scripts written in [AngelScript](https://www.angelcode.com/angelscript/). **Silverscript** is Project Silverkeep's scripting API for AngelScript: the objects, types and functions scripts use to reach the game.

These docs are for people who want to script or mod the game. They're early, like the game itself, and will grow with it.

Pick a topic below, or switch between them with the selector at the top of the sidebar on any docs page.

## Silverscript

- [Getting started](silverscript/getting-started/): where scripts live, how creatures run them, and a first script.
- [API reference](reference/silverscript/): every object, type, enum and global function scripts can use.

## Data formats

- [Data files overview](data/overview/): where game data lives and how modules and overrides fit in.
- [Format reference](reference/data/): every TOML data format, field by field, with a downloadable schema for each.

## Console commands

- [Console commands](reference/console/): the custom console commands for testing and debugging, with their arguments and an example of each.

The reference pages are generated from the game itself, so they match the current build.

## Built with AngelScript

Project Silverkeep's scripting runs on [AngelScript](https://www.angelcode.com/angelscript/), an open-source scripting language by Andreas Jönsson, used under the [zlib license](https://opensource.org/license/zlib). The language is his work; Silverscript is the game's API on top of it.
