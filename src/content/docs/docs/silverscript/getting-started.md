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

These hooks are called in the current build:

| Hook | Function | When it runs |
|---|---|---|
| `on_spawn` | `void OnSpawn(FEntityId Self)` | Once, when the creature is made (not when a save is loaded) |
| `on_heartbeat` | `void OnHeartbeat(FEntityId Self)` | Once every round (6 seconds), in or out of combat |
| `on_damaged` | `void OnDamaged(FEntityId Self, FDamage Damage)` | When the creature takes damage, a killing blow included |
| `on_death` | `void OnDeath(FEntityId Self, FEntityId Killer)` | When the creature dies |
| `on_ability_used_at` | `void OnAbilityUsedAt(FEntityId Self, FAbilityUse Use)` | When a spell or other ability affects the creature |

:::note
The creature format also lists `on_physical_attacked` and `on_dialogue` (see the [creature data format](../../reference/data/creature/)), but the current build doesn't call them yet.
:::

## Reaching the game

Scripts don't touch the game's internals. They call global functions grouped into namespaces, one per area of the game:

| Namespace | What it covers |
|---|---|
| `Creatures::` | Creating creatures, their data, creature type and look |
| `Health::`, `Stats::`, `Conditions::` | Hit points and damage, ability scores and other numbers, states such as Dying |
| `Inventory::`, `Equipment::`, `Items::` | What creatures carry and wear, and items wherever they are |
| `Actions::` | Queuing actions, and rolls that resolve at once: saves, skill checks, touch attacks |
| `Scripts::` | Variables that scripts keep between runs, and delayed calls |
| `Log::` | Writing to the game log |
| `Factions::` | Factions, standing, Fame and Infamy |

Calls look like `Health::GetHealth(Self)` or `Log::Info("Hello")`. The [Silverscript API reference](../../reference/silverscript/) lists every namespace and function.

## A first script

This heartbeat script counts heartbeats in a variable stored on the creature, and logs a line every tenth one:

```cpp
void OnHeartbeat(FEntityId Self)
{
    int Beats = Scripts::GetLocalInt(Self, "beats") + 1;
    Scripts::SetLocalInt(Self, "beats", Beats);

    if (Beats % 10 == 0)
    {
        FCreatureData Creature = Creatures::GetData(Self);
        Log::Info(Creature.Metadata.Name + " is still keeping watch.");
    }
}
```

Save it as `Content/Angelscripts/Guard_OnHeartbeat.as` and point a creature's `on_heartbeat` at it.
