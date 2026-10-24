// TODO: Importar a interface Book a partir do ficheiro partilhado
import type { Supplement } from "../../shared/types";
/**
 * Efetua um pedido HTTP GET ao backend utilizando a Fetch API nativa
 */
async function checkServerAlive(): Promise<void> {
  const statusElement = document.getElementById("status");

  try {
    const response = await fetch("http://localhost:3000/api/alive");

    if (!response.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    const data = await response.json();

    if (statusElement) {
      statusElement.innerHTML = `
        ${data.message}<br>
        Estado: ${data.status}<br>
        Preview: ${data.preview}
      `;
    }
  } catch (error: any) {
    if (statusElement) {
      statusElement.textContent = error.message;
    }
  }
}

async function fetchCatalog(): Promise<void> {
  const catalogContainer = document.getElementById("supplements-catalog");

  if (!catalogContainer) {
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/supplements");

    if (!response.ok) {
      throw new Error("Erro ao carregar o catálogo");
    }

    const supplements: Supplement[] = await response.json();

    catalogContainer.innerHTML = supplements
      .map(
        (supplement) => `
          <p>
            <strong>${supplement.name}</strong><br>
            Laboratório: ${supplement.laboratory}<br>
            Preço: ${supplement.price} €<br>
            Stock: ${supplement.stock}
          </p>
        `,
      )
      .join("");
  } catch (error: any) {
    catalogContainer.innerHTML = `<p>Erro ao carregar catálogo: ${error.message}</p>`;
  }
}

function initLivefeed(): void {
  const feedContainer = document.getElementById("live-notifications");

  if (!feedContainer) {
    console.error("ERRO: Elemento live-notifications não encontrado!");
    return;
  }

  console.log("SSE: A iniciar ligação...");

  const eventSource = new EventSource("/api/events");

  eventSource.onopen = () => {
    console.log("SSE: Ligação estabelecida!");
  };

  eventSource.onmessage = (event: MessageEvent) => {
    console.log("SSE: Mensagem recebida:", event.data);

    try {
      const data = JSON.parse(event.data);

      const paragraph = document.createElement("p");
      paragraph.textContent = data.message;

      feedContainer.prepend(paragraph);
    } catch (error) {
      console.error("SSE: Erro ao processar mensagem:", error);
    }
  };

  eventSource.onerror = () => {
    console.error("SSE: Erro na ligação. Estado:", eventSource.readyState);
  };
}
// Executa a verificação ao carregar o script
checkServerAlive();
fetchCatalog();
initLivefeed();
