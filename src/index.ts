// Framework-agnostic entry. React wrapper lives at "@jasimvkarim/fetchlogger/react".
export {
  installFetchLogger,
  uninstallFetchLogger,
  subscribe,
  getLogs,
  clearLogs,
  isInstalled,
  type FetchLog,
  type InstallOptions,
} from "./core";

export { mountFetchLoggerPanel, type MountOptions } from "./panel";
