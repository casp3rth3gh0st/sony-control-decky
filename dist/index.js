const manifest = {"name":"Sony Control"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaHeadphones (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256 32C114.52 32 0 146.496 0 288v48a32 32 0 0 0 17.689 28.622l14.383 7.191C34.083 431.903 83.421 480 144 480h24c13.255 0 24-10.745 24-24V280c0-13.255-10.745-24-24-24h-24c-31.342 0-59.671 12.879-80 33.627V288c0-105.869 86.131-192 192-192s192 86.131 192 192v1.627C427.671 268.879 399.342 256 368 256h-24c-13.255 0-24 10.745-24 24v176c0 13.255 10.745 24 24 24h24c60.579 0 109.917-48.098 111.928-108.187l14.382-7.191A32 32 0 0 0 512 336v-48c0-141.479-114.496-256-256-256z"},"child":[]}]})(props);
}

const getStatus = callable("status");
const setMode = callable("set_mode");
const setLevel = callable("set_ambient_level");
const setFocus = callable("set_focus_on_voice");
function Content() {
    const [state, setState] = SP_REACT.useState({ connected: false, battery: null, ambient_level: 10 });
    const [busy, setBusy] = SP_REACT.useState(false);
    const [error, setError] = SP_REACT.useState("");
    const refresh = async () => { try {
        setState(await getStatus());
    }
    catch (e) {
        setError(String(e));
    } };
    SP_REACT.useEffect(() => { refresh(); const t = setInterval(refresh, 5000); return () => clearInterval(t); }, []);
    const action = async (fn) => {
        if (busy)
            return;
        setBusy(true);
        setError("");
        try {
            const result = await fn();
            if (result?.error)
                setError(result.error);
            await refresh();
        }
        catch (e) {
            setError(String(e));
        }
        finally {
            setBusy(false);
        }
    };
    const btn = { minWidth: 0, flex: 1 };
    return SP_JSX.jsxs(DFL.PanelSection, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { width: "100%", padding: "8px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [SP_JSX.jsx("strong", { children: "Sony WH-1000XM5" }), SP_JSX.jsx("span", { style: { color: state.connected ? "#80d88b" : "#d58a8a" }, children: state.connected ? "● Connected" : "○ Disconnected" })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { padding: "4px", opacity: 0.85 }, children: ["Battery ", SP_JSX.jsx("strong", { children: state.battery == null ? "—" : `${state.battery}%` })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", width: "100%", gap: "6px" }, children: [SP_JSX.jsx(DFL.DialogButton, { style: btn, disabled: busy || !state.control_available, onClick: () => action(() => setMode("anc")), children: "Noise Cancelling" }), SP_JSX.jsx(DFL.DialogButton, { style: btn, disabled: busy || !state.control_available, onClick: () => action(() => setMode("ambient")), children: "Ambient" }), SP_JSX.jsx(DFL.DialogButton, { style: btn, disabled: busy || !state.control_available, onClick: () => action(() => setMode("off")), children: "Off" })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { width: "100%", padding: "8px 4px" }, children: [SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "6px" }, children: [SP_JSX.jsx("span", { children: "Ambient sound intensity" }), SP_JSX.jsx("span", { children: state.ambient_level ?? 10 })] }), SP_JSX.jsx("input", { "aria-label": "Ambient sound intensity", type: "range", min: "0", max: "20", step: "1", value: state.ambient_level ?? 10, disabled: busy || !state.control_available, onChange: e => { const value = Number(e.currentTarget.value); setState((s) => ({ ...s, ambient_level: value })); }, onMouseUp: e => action(() => setLevel(Number(e.currentTarget.value))), onTouchEnd: e => action(() => setLevel(Number(e.currentTarget.value))), style: { width: "100%" } }), SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", opacity: 0.65, fontSize: "0.8em" }, children: [SP_JSX.jsx("span", { children: "0" }), SP_JSX.jsx("span", { children: "20" })] })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs(DFL.DialogButton, { style: { width: "100%" }, disabled: busy || !state.control_available, onClick: () => action(() => setFocus(!state.focus_on_voice)), children: ["Focus on Voice: ", state.focus_on_voice ? "On" : "Off"] }) }), !state.control_available && SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { padding: "4px", color: "#e6bd75" }, children: "Install sony-headphones-linux to enable headphone controls." }) }), !!(error || state.error) && SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { padding: "4px", color: "#e88" }, children: error || state.error }) })] });
}
var index = definePlugin(() => ({ name: "Sony Control", icon: SP_JSX.jsx(FaHeadphones, {}), content: SP_JSX.jsx(Content, {}) }));

export { index as default };
//# sourceMappingURL=index.js.map
