import * as http from 'http';  //importamos este módulo que já é do Node.js para criar servidores HTTP

import {Supplement, SupplementCategory} from '../../shared/types.js';

import { SupplementsRepository } from './features/supplements/supplements.repository.js';

const repository = new SupplementsRepository();

const PORT = 3000; //define a Porta TCP onde os ervidor backend vai ficar a ouvir pedidos


//http.createServer(...) cria um servidor HTTP que vai ouvir pedidos na porta definida em PORT
//(req,res) =>{..} é uma função de callback que vai ser chamada sempre que o servidor receber um pedido HTTP
//req ("request") contém os dados do pedido cliente, como o método HTTP (GET, POST, etc.), a URL, os cabeçalhos e o corpo da mensagem
//res ("response") é o objeto que usamos para contruir e enviar a resposta ao cliente.
// Em vez de (req, res), tipas explicitamente assim:
const server: http.Server = http.createServer(async(req: http.IncomingMessage, res: http.ServerResponse) => {

  // Configura o CORS para permitir que a aplicação fronted consiga fazer pedidos a este servidor sem ser bloqueada pelo navegador

res.setHeader('Access-Control-Allow-Origin', '*'); //autoriza qualquer origem a ler os dados
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); //especifica os métodos HTTP permitidos
res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // autoriza o envio do cabeçalho de tipo de conteúdo

if(req.method === 'OPTIONS'){ //o navegaor envia um pedido automático do tipo OPTIONS antes de enviar o pedido real (GET ou POST) para verificar se o servidor aceita o pedido

  res.writeHead(204); //devolve o código 204 No Content (sucesso, mas sem conteúdo na resposta)

  res.end(); //Encerra a resposta imediatamente

  return; //sai da função de callback para não processar o pedido real
}


// Define a rota principal da nossa API. Verifica se o URL pedido é exatamente '/api/alive' e se o método é leitura ('GET')
if(req.url === '/api/alive' && req.method === 'GET'){ 

  //devolve o código 200 (OK) que indica sucesso
  //'Content-Type': 'application/json'  informa o fronted que o corpo da resposta está em formato JSON
  res.writeHead(200, {'Content-Type': 'application/json'}); //devolve o código 200 OK e informa que o corpo da resposta vai ser JSON

  //JSON.stringify() converte o objeto JavaScript num texto formato JSON
  //res.end() envia esse texto para o frontend e termina a comunicação
  res.end(JSON.stringify({
    message: 'Servidor backend está vivo e a responder a pedidos!',
    status: 'ok',
    timestamp: new Date().toISOString(),
    preview: 'Servidor backend'
  }));
}

else if (req.url === '/api/supplements' && req.method === 'GET') {
  try {
    const supplements = await repository.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(supplements));
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
  }
}


else if (req.url === '/api/events' && req.method === 'GET') {
  // abre a ligação SSE: os cabeçalhos mantêm o canal aberto e sem cache
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // primeiro evento, para confirmar que a ligação ficou estabelecida
  res.write('data: {"message":"Ligação SSE estabelecida"}\n\n');

  // o cliente fechou a ligação
  const interval = setInterval(async () => {
    try {
      const supplements = await repository.getAll();
      if (supplements.length === 0) return;

      const supplement = supplements[Math.floor(Math.random() * supplements.length)];
      const notification = {
        type: 'purchase',
        message: `Foi comprado: ${supplement.name}`,
        supplementId: supplement.id,
        timestamp: new Date().toISOString()
      };

      res.write(`data: ${JSON.stringify(notification)}\n\n`);
    } catch {
      clearInterval(interval);
    }
  }, 5000);

  // o cliente fechou a ligação: pára o temporizador
  req.on('close', () => {
    clearInterval(interval);
    console.log('Cliente SSE desligado');
  });
}

//caso o cliente tente aceder a uma rota que não existe 
else{

  //devolve o codigo 404 (Not Found) que indica que a rota não existe
  res.writeHead(404, {'Content-Type': 'text/plain'});

  //envia a mensagem de erro e fecha o pedido
  res.end('Endpoint não encontrado');
}


});

//coloca o servidor "online" a escutar pedidos na porta definida em PORT (porta 3000)
server.listen(PORT, () => {

  //esta função de callback executa apenas uma vez, assim que o servidor arranca com sucesso
  console.log(`Servidor backend a correm em http://localhost:${PORT}`);
});