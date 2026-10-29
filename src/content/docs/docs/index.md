---
title: Documentation
description: Guides and reference for scripting and modding Project Silverkeep.
sidebar:
  label: Welcome
  order: 0
---

Project Silverkeep is built to be modded. Game rules and content live in data files you can edit, and creatures run scripts written in [AngelScript](https://www.angelcode.com/angelscript/). **Silverscript** is Project Silverkeep's scripting API for AngelScript: the objects, types and functions scripts use to reach the game.

These docs are for people who want to script or mod the game. They're early, like the game itself, and will grow with it.

## Start here

- [Silverscript: getting started](silverscript/getting-started/): where scripts live, how creatures run them, and a first script.
- [Data files overview](data/overview/): where game data lives and how modules and overrides fit in.

## Reference

The reference pages are generated from the game itself, so they match the current build:

- [Silverscript API](reference/silverscript/): every object, type, enum and global function scripts can use.
- [Data formats](reference/data/): every TOML data format, field by field, with a downloadable schema for each.

## Built with AngelScript

Project Silverkeep's scripting runs on [AngelScript](https://www.angelcode.com/angelscript/), an open-source scripting language by Andreas Jönsson, used under the [zlib license](https://opensource.org/license/zlib). The language is his work; Silverscript is the game's API on top of it.
