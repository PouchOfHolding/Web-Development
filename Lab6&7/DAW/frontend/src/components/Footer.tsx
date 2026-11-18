export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1b5e20",
        color: "#ffffff",
        padding: "1rem",
        textAlign: "center",
      }}

      //new Date().getFullYear() dá o ano atual, para não teres de o atualizar à mão
    >
      <p style={{ margin: 0 }}> 
        © {new Date().getFullYear()} Supplement Store. Todos os direitos reservados. 
      </p>
    </footer>
  );
}