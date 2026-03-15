export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
        ✨ Explainify
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "500px" }}>
        AI-Powered Knowledge Retrieval &amp; Learning Platform
      </p>
      <p style={{ marginTop: "2rem", color: "#999", fontSize: "0.9rem" }}>
        Backend API is running. Use the API endpoints to interact.
      </p>
      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "left",
          background: "#f5f5f5",
          padding: "1rem 1.5rem",
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontFamily: "monospace",
        }}
      >
        <p>
          <strong>POST</strong> /api/upload
        </p>
        <p>
          <strong>POST</strong> /api/query
        </p>
        <p>
          <strong>POST</strong> /api/summarize
        </p>
        <p>
          <strong>POST</strong> /api/video-explain
        </p>
      </div>
    </main>
  );
}
