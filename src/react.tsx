// Optional React wrapper. Reuses the single vanilla panel implementation, so
// there is only one UI to maintain. Import from "@jasimvkarim/fetchlogger/react".
import { useEffect } from "react";
import { mountFetchLoggerPanel, type MountOptions } from "./panel";

export type FetchLoggerProps = MountOptions;

/**
 * Drop-in React component. Render once near the root of your app:
 *   <FetchLogger />
 * It mounts the floating panel and patches fetch on mount, and cleans up on unmount.
 */
export default function FetchLogger(props: FetchLoggerProps = {}) {
  useEffect(() => {
    const unmount = mountFetchLoggerPanel(props);
    return unmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
