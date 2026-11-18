import Header from "./components/Header";
import NavBar from "./components/NavBar";
import SupplementCatalog from "./components/SupplementCatalog";
import Footer from "./components/Footer";

//App junta os componentes pela ordem em que aparecem na página
//O <main> envolve só o conteúdo principal (o catálogo). Só pode haver um por página, e o cabeçalho, a navegação e o rodapé ficam fora.
export default function App() {
  return (
    <>
      <Header />
      <NavBar />
      <main>
        <SupplementCatalog />
      </main>
      <Footer />
    </>
  );
}