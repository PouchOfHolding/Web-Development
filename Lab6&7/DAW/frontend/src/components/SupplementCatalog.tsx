import { SupplementCategory } from "../../../shared/types";
import type { Supplement } from "../../../shared/types";
import SupplementCard from "./SupplementCard";

// Dados estáticos (nesta fase ainda não vêm do backend)
const supplements: Supplement[] = [
  {
    id: "sup-101",
    name: "Creatina Monohidratada",
    laboratory: "NutriLab",
    price: 24.9,
    category: SupplementCategory.Sports,
    stock: 30,
    description: "Creatina monohidratada em pó.",
  },
  {
    id: "sup-102",
    name: "Whey Protein",
    laboratory: "Power Nutrition",
    price: 34.5,
    category: SupplementCategory.Protein,
    stock: 18,
    description: "Proteína whey sabor chocolate.",
  },
  {
    id: "sup-103",
    name: "Multivitamínico",
    laboratory: "VitaPlus",
    price: 15.99,
    category: SupplementCategory.Vitamins,
    stock: 40,
    description: "Complexo multivitamínico diário.",
  },
];

export default function SupplementCatalog() {
  return (
    <section id="catalog" style={{ padding: "1rem" }}>
      <h2>Catálogo de Suplementos</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", //faz a grelha ajustar o número de colunas à largura do ecrã
          gap: "1rem",
        }}
      >
        {supplements.map((supplement) => ( //.map() transforma cada suplemento do array num <SupplementCard />. É a forma de se fazer lsitas em React sem repetir html
          <SupplementCard key={supplement.id} supplement={supplement} /> //com key={supplement.id} o React precisa de uma chave única por item para saber qual é qual quando a lista mudar
        ))}
      </div>
    </section>
  );
}