import { useState } from "react";
import DataTable from "../components/DataTable";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div
      style={{
        padding: "1.5rem",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Products</h1>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "0.6rem",
          width: "100%",        // ✅ full width
          maxWidth: "400px",    // ✅ limit size on large screens
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <div style={{ width: "100%" }}>
        <DataTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}