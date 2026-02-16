export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a
        href="/"
        style={{
          marginTop: "20px",
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Go to Home
      </a>
    </div>
  );
}
