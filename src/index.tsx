import { callable, definePlugin } from "@decky/api";
import { PanelSection, PanelSectionRow, DialogButton } from "@decky/ui";
import { useEffect, useState } from "react";
import { FaHeadphones } from "react-icons/fa";

const getStatus = callable<[], any>("status");
const setMode = callable<[string], any>("set_mode");
const setLevel = callable<[number], any>("set_ambient_level");
const setFocus = callable<[boolean], any>("set_focus_on_voice");

function Content() {
  const [state, setState] = useState<any>({ connected: false, battery: null, ambient_level: 10 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const refresh = async () => { try { setState(await getStatus()); } catch (e) { setError(String(e)); } };
  useEffect(() => { refresh(); const t = setInterval(refresh, 5000); return () => clearInterval(t); }, []);
  const action = async (fn: () => Promise<any>) => {
    if (busy) return;
    setBusy(true); setError("");
    try { const result = await fn(); if (result?.error) setError(result.error); await refresh(); }
    catch (e) { setError(String(e)); }
    finally { setBusy(false); }
  };
  const btn = { minWidth: 0, flex: 1 } as const;
  return <PanelSection>
    <PanelSectionRow>
      <div style={{ width: "100%", padding: "8px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Sony WH-1000XM5</strong>
        <span style={{ color: state.connected ? "#80d88b" : "#d58a8a" }}>{state.connected ? "● Connected" : "○ Disconnected"}</span>
      </div>
    </PanelSectionRow>
    <PanelSectionRow>
      <div style={{ padding: "4px", opacity: 0.85 }}>Battery <strong>{state.battery == null ? "—" : `${state.battery}%`}</strong></div>
    </PanelSectionRow>
    <PanelSectionRow>
      <div style={{ display: "flex", width: "100%", gap: "6px" }}>
        <DialogButton style={btn} disabled={busy || !state.control_available} onClick={() => action(() => setMode("anc"))}>Noise Cancelling</DialogButton>
        <DialogButton style={btn} disabled={busy || !state.control_available} onClick={() => action(() => setMode("ambient"))}>Ambient</DialogButton>
        <DialogButton style={btn} disabled={busy || !state.control_available} onClick={() => action(() => setMode("off"))}>Off</DialogButton>
      </div>
    </PanelSectionRow>
    <PanelSectionRow>
      <div style={{ width: "100%", padding: "8px 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><span>Ambient sound intensity</span><span>{state.ambient_level ?? 10}</span></div>
        <input aria-label="Ambient sound intensity" type="range" min="0" max="20" step="1" value={state.ambient_level ?? 10}
          disabled={busy || !state.control_available}
          onChange={e => { const value = Number(e.currentTarget.value); setState((s: any) => ({ ...s, ambient_level: value })); }}
          onMouseUp={e => action(() => setLevel(Number((e.currentTarget as HTMLInputElement).value)))}
          onTouchEnd={e => action(() => setLevel(Number((e.currentTarget as HTMLInputElement).value)))}
          style={{ width: "100%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.65, fontSize: "0.8em" }}><span>0</span><span>20</span></div>
      </div>
    </PanelSectionRow>
    <PanelSectionRow>
      <DialogButton style={{ width: "100%" }} disabled={busy || !state.control_available}
        onClick={() => action(() => setFocus(!state.focus_on_voice))}>
        Focus on Voice: {state.focus_on_voice ? "On" : "Off"}
      </DialogButton>
    </PanelSectionRow>
    {!state.control_available && <PanelSectionRow><div style={{ padding: "4px", color: "#e6bd75" }}>Install sony-headphones-linux to enable headphone controls.</div></PanelSectionRow>}
    {!!(error || state.error) && <PanelSectionRow><div style={{ padding: "4px", color: "#e88" }}>{error || state.error}</div></PanelSectionRow>}
  </PanelSection>;
}

export default definePlugin(() => ({ name: "Sony Control", icon: <FaHeadphones />, content: <Content /> }));
