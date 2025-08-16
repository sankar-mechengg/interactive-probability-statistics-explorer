// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Interactive Probability & Statistics Explorer",
  description:
    "Learn probability and statistics through interactive visualizations and examples.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
