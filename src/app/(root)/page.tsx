import { asset } from "@/lib/asset";

// L'adresse principale renvoie vers le site en hébreu.
export default function RootPage() {
  const to = asset("/he/");
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <link rel="canonical" href={to} />
      <p style={{ fontFamily: "system-ui", padding: 24 }}>
        <a href={to}>Flora Wigs</a>
      </p>
    </>
  );
}
