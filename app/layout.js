import "./globals.css";

export const metadata = {
  title: "Northstar | Portfolio Analyzer",
  description: "A focused view of your investment portfolio."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
