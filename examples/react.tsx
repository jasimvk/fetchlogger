// React usage example.
//
//   npm i -D @jasimvk/fetchlogger
//
// Render <FetchLogger /> once near the root of your app. Gate it however you
// like — here it's shown only outside production.
import FetchLogger from "@jasimvk/fetchlogger/react";

export default function App() {
  return (
    <>
      {process.env.NODE_ENV !== "production" && (
        <FetchLogger
          defaultOpen
          position="bottom-center"
          // pull a short label out of JSON request bodies (e.g. an API code)
          getLabel={(body) => (body as any)?.API_Code}
        />
      )}

      {/* ...the rest of your app... */}
      <YourApp />
    </>
  );
}

declare function YourApp(): JSX.Element;
