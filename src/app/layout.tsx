import type { Metadata } from "next";
import { DocumentProvider } from "@/context/DocumentContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Explainify — AI-Powered Knowledge Retrieval",
  description:
    "Upload documents, ask questions, generate summaries, and learn through AI-powered visual explanations.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DocumentProvider>
            <div className="flex flex-col min-h-screen bg-light">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </DocumentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
