---
title: Data files overview
description: Where Project Silverkeep's game data lives, how it's loaded, and how modules and overrides fit in.
sidebar:
  label: Data files
  order: 2
---

Most of Project Silverkeep's rules and content are data, not code. Classes, races, feats, skills, creatures, factions and sounds are each defined in [TOML](https://toml.io/) files the game reads when it starts.

## Where data lives

| Folder | Contents |
|---|---|
| `Content/Data/Classes/` | Character classes |
| `Content/Data/Races/` | Playable races |
| `Content/Data/Feats/General/`, `Content/Data/Feats/Racial/` | Feats |
| `Content/Data/Skills/` | Skills |
| `Content/Data/Creatures/` | Creature templates |
| `Content/Data/Factions/` | Factions |
| `Content/Data/Sounds/` | Named sounds, music and ambience |
| `Modules/<Name>/module.toml` | Modules (campaigns and the main menu) |

Each file holds one definition, identified by its `id`. Sound files are the exception: one file can hold many `[[sound]]` entries.

## How files are read

- **Missing keys fall back to defaults.** Every format lists its defaults in the [data format reference](../../reference/data/).
- **Unknown keys are ignored**, so a typo in a key name won't stop the game loading, but it won't do anything either.
- **A file without an id is skipped.** Some formats log a warning for values they can't use, such as an unknown faction stance, and fall back to a default.

## Schemas

Each format is described by a [TOML Schema](https://tomlschema.org/spec/) file, linked from its reference page. The schemas document the formats; the game doesn't check files against them yet.

## Modules and overrides

A module is a self-contained set of content, such as a campaign, described by `Modules/<Name>/module.toml`. The `Override/` folder is reserved for replacing individual files without touching the originals. Both are early scaffolding, and more of the layering will arrive as the toolset does.
