# Diamond K9 Cockpit Guide

BLUF: This is a local second-screen quick reference for Star Citizen and Organization Diamond K9: main guide sections, ship-specific subguides, standard keys, operating flows, buy locations, and buyable loadout recommendations.

## Current ship list

- Constellation Taurus
- C2 Hercules
- Cutlass Black
- Scorpius
- Prospector
- ARGO MOLE
- Vulture
- C8R Pisces Rescue
- ROC
- Ursa Medivac
- Appendix: Caterpillar

## Run it

Open `index.html` directly in a browser, or run the local server:

```powershell
.\Start-StarCitizenGuide.ps1
```

For double-click use on Windows, run:

```text
Start-StarCitizenGuide.cmd
```

The script serves only this folder on `127.0.0.1` and opens the browser. It does not change Windows, Star Citizen, or your game files.
The local server sends `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`, `Pragma: no-cache`, and `Expires: 0` so Chrome and Edge pick up recent JavaScript, CSS, and data changes after a refresh. `index.html` also uses versioned local CSS/JS/data URLs to force Chrome to request the newest files after guide updates.

The URL `http://127.0.0.1:8787/index.html` only works while the local server is running. If you want it available after Windows login, create or keep the user Startup shortcut named `Star Citizen Guide Server`.

## Build a portable Windows EXE

Build a sendable Windows package:

```powershell
.\tools\Build-PortableExe.ps1
```

The build creates:

- `%USERPROFILE%\Downloads\DiamondK9CockpitGuide\DiamondK9CockpitGuide.exe`
- `%USERPROFILE%\Downloads\DiamondK9CockpitGuide.zip`

Users only need to unzip the package and double-click `DiamondK9CockpitGuide.exe`. The EXE contains the guide files, starts a local `127.0.0.1` web server, and opens the default browser. It does not install services, change Star Citizen files, or require Codex.

The build script uses .NET SDK 9 when it is available. If this PC only has the .NET runtime, the script falls back to the Windows .NET Framework compiler and still creates a single EXE. Users do not need Codex or the SDK when using the generated package.

## Update ship guides

Edit `data/ships.js`. Each ship has:

- `summary`
- `stats`
- `quickActions`
- `saleInfo`
- `modes`
- `procedure`
- `keyGroups`
- optional `keybinds`
- `notes`

Default keybind groups are defined once in `window.SC_KEYBIND_GROUPS`.

The app separates guide areas like this:

- `Solsystemer`: main system hub with Stanton, Pyro, and Nyx subviews. Each system has filtered mining, salvage, refinery, station, shop, and sale references with live UEX/SC Trade links.
- `Standard keys`: common flight, landing, quantum, power, combat, targeting, scanning, FPS, tool, and ground vehicle defaults.
- `Skibsguides`: searchable subguide hub for individual ships. Clicking a ship opens its top `Quick mode` actions, practical `Salg` notes, role flow, ship-specific keybindings, and notes.
- `Skibskøb`: searchable in-game UEC prices and buy locations for the guide ships plus practical transport and ground vehicles. Prices are sourced from UEX and should be live-checked before large purchases.
- `Loadouts`: searchable buyable component and weapon shortlists per ship, with UEX/Erkul links. The section prefers direct in-game purchases and flags stronger parts when they appear to be rent/craft/loot-only.

The Diamond K9 PNG artwork is referenced as `assets/org/diamond-k9-mark.png`. The local PowerShell server maps that path to `%USERPROFILE%\Downloads\DiamondK9-Cockpit-Guide-Mark.png`, and the portable EXE embeds it during build. This avoids copying large binary files into the OneDrive workspace.

The initial keybind set is based on the standard keyboard/mouse layout documented by Star Citizen community references and the in-game reset/profile workflow from RSI support. Star Citizen keybinds can drift between patches, so verify critical commands in-game after major updates.

Sale locations are operational guidance, not guaranteed best-price claims. Before high-value cargo, mining, or salvage runs, check live demand in tools such as UEX or SC Trade Tools and verify the target terminal works in the current patch/server.

Loadout recommendations are practical starting builds, not permanent meta claims. Before expensive component or weapon buys, open the linked UEX item page for live shop stock and verify the whole ship in Erkul.

Sale note links are inferred in `data/ships.js`:

- cargo and general demand notes link to UEX Trade Routes
- RMC notes link to the UEX Recycled Material Composite page
- CMAT notes link to the UEX Construction Materials page
- refinery notes link to UEX Mining Refineries
- mineral/gem notes link to UEX Mining Pricing or Mining Locations

Ship visuals are local SVG files under `assets/ships/`. They are schematic guide images, not external hotlinked assets.

## Rollback

Because this is a static local app, rollback is just Git or file restore:

```powershell
git status
git diff
```

No commit, push, branch change, registry edit, service install, or game configuration change is required by this first version.

## Troubleshooting

- If the PowerShell server script cannot find Python, open `index.html` directly.
- If port `8787` is busy, the script automatically tries the next available local port.
- If `http://127.0.0.1:8787/index.html` does not open, start `Start-StarCitizenGuide.cmd` or check that the `Star Citizen Guide Server` Startup shortcut is running.
- If Chrome still shows an older page from an already-open tab, press `Ctrl+F5` once or close and reopen the tab. After that, future refreshes should use the no-cache headers and versioned files.
- If Windows asks you to choose an app for Python, do not select anything there. The start script is designed to ignore Windows Store Python aliases and use a real `python.exe` or Python Launcher instead.
- If the portable EXE triggers Windows SmartScreen, choose `More info` -> `Run anyway` only when the sender is trusted.
- If a Star Citizen patch changes keybinds or mechanics, update the relevant ship mode in `data/ships.js` and keep older notes until the new flow is verified.
