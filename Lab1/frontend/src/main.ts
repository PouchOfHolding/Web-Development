import { Supplement } from '../../shared/types.js';



async function loadSupplements(): Promise<void> {
  const catalog = document.getElementById("books-catalog");
  if (!catalog) return;

  try {
    const response = await fetch('http://localhost:3000/api/supplements');

    if (!response.ok) {
      throw new Error(`Erro na resposta do servidor: ${response.status}`);
    }

    const supplements: Supplement[] = await response.json();

    catalog.innerHTML = supplements.map((s) => `
      <div>
        <h3>${s.name}</h3>
        <p><strong>Laboratório:</strong> ${s.laboratory}</p>
        <p><strong>Categoria:</strong> ${s.category}</p>
        <p><strong>Preço:</strong> ${s.price} €</p>
        <p><strong>Stock:</strong> ${s.stock} unidades</p>
        ${s.description ? `<p>${s.description}</p>` : ''}
      </div>
    `).join('');
  } catch (error: any) {
    catalog.innerHTML = `<p style="color: red;"><strong>Falha ao carregar o catálogo:</strong> ${error.message}</p>`;
  }
}

loadSupplements();

//Declaramos uma função assíncrona (async) porque vamos fazer pedidos à rede (operações que demoram tempo)
async function checkServerAlive(): Promise<void> {

    //vai procurar no ficheiro index.html a <div> que tem o id="status"
    //é aqui que vamos injetar o resultado recebido da API
  const statusElement = document.getElementById("status");

  //potenciais erros de rede
  try {

    //faz o pedido HTTP GET à rota do nosso backend
    //await pausa a execução desta função e espera que a resposta do servidor chegue antes de avançar
    const response = await fetch('http://localhost:3000/api/alive');

    //se der erro (ex: 404)
    if (!response.ok) {
      throw new Error(`Erro na resposta do servidor: ${response.status}`);
    }

    //lê o corpo da resposta HTTP e converte o texto (formato JSON) para um objeto manipulável em javaScript/TypeScript
    const data = await response.json();

    //antes de alterar a página verificamos se o elemento HTML "status" realmente foi encontrado
    if (statusElement) {

        //guardamos o suplemento que veio da API numa variável fortemente tipada com a interface Supplement
      const item: Supplement = data.preview;

      statusElement.innerHTML = `
        <h2>Estado da API</h2>
        <p><strong>Mensagem:</strong> ${data.message}</p>
        <p><strong>Estado:</strong> ${data.status}</p>
        <p><strong>Hora da Verificação:</strong> ${data.timestamp}</p>
        <hr/>
        <h3>Suplemento em Destaque</h3>
        <p><strong>ID:</strong> ${item.id}</p>
        <p><strong>Nome:</strong> ${item.name}</p>
        <p><strong>Laboratório:</strong> ${item.laboratory}</p>
        <p><strong>Categoria:</strong> ${item.category}</p>
        <p><strong>Preço:</strong> ${item.price} €</p>
        <p><strong>Stock Disponível:</strong> ${item.stock} unidades</p>
        ${item.description ? `<p><strong>Descrição:</strong> ${item.description}</p>` : ''}
      `;
    }

    //se qualquer coisa falhar
  } catch (error: any) {
    if (statusElement) {
      statusElement.innerHTML = `<p style="color: red;"><strong>Falha ao ligar ao backend:</strong> ${error.message}</p>`;
    }
  }
}

// Executa a verificação ao carregar a página
checkServerAlive();