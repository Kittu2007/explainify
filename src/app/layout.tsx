import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explainify — AI-Powered Knowledge Retrieval",
  description:
    "Upload documents, ask questions, generate summaries, and learn through AI-powered visual explanations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
