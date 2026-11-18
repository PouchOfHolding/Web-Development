import type { Supplement } from "../../../shared/types";

interface SupplementCardProps {
  supplement: Supplement;
}

export default function SupplementCard({ supplement }: SupplementCardProps) {
  return (
    <article
      style={{
        border: "1px solid #cccccc",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{supplement.name}</h3>
      <p>Laboratório: {supplement.laboratory}</p>
      <p>Categoria: {supplement.category}</p>
      <p>Preço: {supplement.price.toFixed(2)} €</p>
      <p>Stock: {supplement.stock}</p>
      {supplement.description && <p>{supplement.description}</p>}
    </article>
  );
}