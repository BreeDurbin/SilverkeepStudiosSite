---
title: Getting started with Silverscript
description: Where AngelScript scripts live, how creatures run them, and how they reach the game through the Silverscript API.
sidebar:
  label: Silverscript basics
  order: 1
---

Project Silverkeep's scripts are written in [AngelScript](https://www.angelcode.com/angelscript/), an open-source scripting language by Andreas Jönsson. It's statically typed with C++-like syntax, so if you've written C++, C# or Java it will look familiar. The [AngelScript manual](https://www.angelcode.com/angelscript/sdk/docs/manual/doc_script.html) covers the language itself.

**Silverscript** is Project Silverkeep's scripting API for AngelScript: the game objects, types and functions your scripts call. This page covers how scripts are attached to the game and how they use that API.

## Where scripts live

Scripts are `.as` files under the game's `Content/Angelscripts/` folder. Each file is compiled on first use and cached.

## Attaching scripts to creatures

A creature template (a TOML file in `Content/Data/Creatures/`) names the scripts to run on its events in a `[script_hooks]` table. Paths are relative to `Content/`:

```toml
[script_hooks]
on_heartbeat = "/Angelscripts/Guard_OnHeartbeat.as"
```

Each hook calls a function with a fixed name and signature in its file. The heartbeat hook calls:

```cpp
void OnHeartbeat(FEntityId Self)
```

`Self` is the creature the script runs for.

:::note
The creature format already lists hooks for spawning, death, damage, dialogue and more (see the [creature data format](../../reference/data/creature/)), but only `on_heartbeat` is called in the current build. The others will be wired up as those systems arrive.
:::

## Reaching the game

Scripts don't touch the game's internals. They go through a few API objects, each with a global getter:

| Getter | What it covers |
|---|---|
| `GetEntityApi()` | Creatures and items: creating, health, ability scores, inventory, levels, feats and skills. |
| `GetScriptApi()` | Logging, plus variables you can store globally or on an entity. |
| `GetFactionApi()` | Factions, standing, Fame and Infamy, offenses and ranks. |

The [Silverscript API reference](../../reference/silverscript/) lists every method.

## A first script

This heartbeat script counts heartbeats in a variable stored on the creature, and logs a line every tenth one:

```cpp
void OnHeartbeat(FEntityId Self)
{
    int Beats = GetScriptApi().GetLocalInt(Self, "beats") + 1;
    GetScriptApi().SetLocalInt(Self, "beats", Beats);

    if (Beats % 10 == 0)
    {
        FCreatureData Creature = GetEntityApi().GetCreatureData(Self);
        GetScriptApi().LogInfo(Creature.Metadata.Name + " is still keeping watch.");
    }
}
```

Save it as `Content/Angelscripts/Guard_OnHeartbeat.as` and point a creature's `on_heartbeat` at it.
