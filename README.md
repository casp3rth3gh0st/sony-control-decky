# Sony Control Decky

A Decky Loader plugin for Sony WH-1000XM5 headphones. It shows BlueZ connection and battery information and provides Noise Cancelling, Ambient Sound, Off, ambient intensity (0–20), and Focus on Voice controls.

## Bluetooth controller dependency

Noise controls use `sony-headphonesctl`, provided by [sony-headphones-linux](https://github.com/VyomJain6904/sony-headphones-linux). Install that controller on SteamOS and make sure the executable is on Decky's `PATH`. The plugin reads basic connection/battery data from `bluetoothctl` as a fallback. The WH-1000XM5 control protocol is proprietary and reverse engineered; protocol behavior has not been tested on this Deck or headset. Firmware changes may affect compatibility. The controller project reports a tested WH-1000XM5 path on firmware 2.5.1.

## Build

```sh
pnpm install
pnpm run build
```

Install the resulting plugin directory through Decky Loader's developer mode. This repo follows the SteamDeckHomebrew Decky plugin template structure.
