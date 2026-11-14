"""Decky backend for Sony WH-1000XM5.

The Sony MDR v2 control transport is delegated to sony-headphonesctl (libmdr).
Install sony-headphones-linux and ensure sony-headphonesctl is on PATH. Bluetooth
status and battery are read from BlueZ when available. Hardware/protocol behavior
must be validated against the user's headset and firmware.
"""
import asyncio
import json
import os
import re
import shutil

DEVICE_NAME = "WH-1000XM5"


class Plugin:
    async def _main(self):
        self.cli = shutil.which("sony-headphonesctl")

    async def _run(self, *args):
        if not self.cli:
            return None, "sony-headphonesctl not found; install sony-headphones-linux"
        try:
            proc = await asyncio.create_subprocess_exec(
                self.cli, *args, stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            out, err = await asyncio.wait_for(proc.communicate(), timeout=4)
            if proc.returncode != 0:
                return None, (err.decode(errors="replace").strip() or "Sony command failed")
            return out.decode(errors="replace").strip(), None
        except asyncio.TimeoutError:
            return None, "Sony headphone command timed out"
        except Exception as exc:
            return None, str(exc)

    async def _bluez_status(self):
        try:
            proc = await asyncio.create_subprocess_exec(
                "bluetoothctl", "devices", "Connected",
                stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )
            out, _ = await asyncio.wait_for(proc.communicate(), timeout=2)
            lines = out.decode(errors="replace").splitlines()
            match = next((line for line in lines if DEVICE_NAME.lower() in line.lower()), None)
            if not match:
                return {"connected": False, "battery": None}
            address = match.split()[1]
            info = await asyncio.create_subprocess_exec(
                "bluetoothctl", "info", address,
                stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )
            out, _ = await asyncio.wait_for(info.communicate(), timeout=2)
            text = out.decode(errors="replace")
            level = re.search(r"Battery Percentage:\s*(?:0x[0-9a-fA-F]+\s*)?\((\d+)\)", text)
            if not level:
                level = re.search(r"Battery Percentage:\s*(\d+)", text)
            return {"connected": True, "battery": int(level.group(1)) if level else None}
        except Exception:
            return {"connected": False, "battery": None}

    async def status(self):
        bluez = await self._bluez_status()
        raw, error = await self._run("status")
        state = {}
        if raw:
            try:
                state = json.loads(raw)
            except (ValueError, TypeError):
                # Newer builds may emit human-readable status; keep BlueZ state.
                pass
        return {
            "connected": bool(state.get("connected", bluez["connected"])),
            "battery": state.get("battery", bluez["battery"]),
            "mode": state.get("mode", ""),
            "ambient_level": int(state.get("ambient_level", 10)),
            "focus_on_voice": bool(state.get("focus_on_voice", False)),
            "control_available": bool(self.cli),
            "error": error if not self.cli else "",
        }

    async def set_mode(self, mode):
        if mode not in ("anc", "ambient", "off"):
            return {"ok": False, "error": "Unsupported noise mode"}
        _, error = await self._run("noise", mode)
        return {"ok": error is None, "error": error or ""}

    async def set_ambient_level(self, level):
        try:
            level = max(0, min(20, int(level)))
        except (TypeError, ValueError):
            return {"ok": False, "error": "Ambient level must be between 0 and 20"}
        _, error = await self._run("ambient-level", str(level))
        return {"ok": error is None, "error": error or ""}

    async def set_focus_on_voice(self, enabled):
        _, error = await self._run("focus-on-voice", "on" if enabled else "off")
        return {"ok": error is None, "error": error or ""}

    async def _unload(self):
        pass
