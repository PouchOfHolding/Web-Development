export default function Header() {
  return (
    <header //cabeçalho
      style={{
        backgroundColor: "#1b5e20",
        color: "#ffffff",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
        <span role="img" aria-label="Logótipo">💊</span> Supplement Store {/*O role="img" e o aria-label fazem os leitores de ecrã tratarem o emoji como uma imagem com descrição*/}
      </h1>
      <p style={{ margin: "0.5rem 0 0", color: "#c8e6c9", fontSize: "1rem" }}>
        A tua plataforma de comércio eletrónico de suplementos
      </p>
    </header>
  );
}