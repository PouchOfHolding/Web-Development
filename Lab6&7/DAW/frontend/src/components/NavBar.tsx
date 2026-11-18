export default function NavBar() {
  const linkStyle = {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
  };

  //navegação principal
  return (
    
    <nav 
      style={{
        backgroundColor: "#2e7d32",
        padding: "0.75rem",
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <a href="#catalog" style={linkStyle}>Catálogo</a>
      <a href="#cart" style={linkStyle}>Carrinho</a>
      <a href="#login" style={linkStyle}>Minha Conta</a>
    </nav>
  );
}