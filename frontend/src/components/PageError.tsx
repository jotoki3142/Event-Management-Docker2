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
      Error
    </h1>
    <h2 style={{ fontSize: "2rem", marginBottom: "1em" }}>
        Đã có lỗi xảy ra
    </h2>
    <p style={{ marginBottom: "2em", color: "#555" }}>
        Đã có lỗi xảy ra ở phía server chúng tôi, chúng tôi sẽ cố gắng khắc phục sớm nhất có thể
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