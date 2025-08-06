import Link from 'next/link';

export default function PageNotFound() {
    return (
<main>
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "60px 20px 40px 20px"
    }}
  >
    <h1 style={{ fontSize: "6rem", color: "#8ebad3", marginBottom: "0.5em" }}>
      404
    </h1>
    <h2 style={{ fontSize: "2rem", marginBottom: "1em" }}>
      Không tìm thấy trang
    </h2>
    <p style={{ marginBottom: "2em", color: "#555" }}>
      Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
    </p>
    <Link
      href="/"
      style={{
        display: "inline-block",
        padding: "12px 32px",
        background: "#8ebad3",
        color: "#fff",
        borderRadius: 6,
        textDecoration: "none",
        fontSize: "1.1rem",
        transition: "background 0.2s"
      }}
    >
      Quay về trang chủ
    </Link>
  </div>
</main>

    );
}