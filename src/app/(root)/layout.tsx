export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ background: "#f7f3ea" }}>{children}</body>
    </html>
  );
}
