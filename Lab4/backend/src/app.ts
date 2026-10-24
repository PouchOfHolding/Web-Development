import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import compression from "compression";
import supplementsRouter from "./features/supplements/supplements.routes.js";
import path from "node:path";

const app: Express = express();

// Middleware de CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});
// Middleware de compressão Gzip
// Compressão Gzip, exceto para o canal SSE
// Middleware de compressão Gzip/Brotli
// Não comprimir a rota SSE, que precisa de enviar dados imediatamente
app.use((req, res, next) => {
  if (req.path === "/api/events") {
    console.log("SSE: pedido excluído da compressão");
    return next();
  }

  return compression()(req, res, next);
});
// Middleware para interpretar pedidos com corpo JSON
app.use(express.json());

// Caminho para o frontend compilado pelo Vite
const frontendPath = path.resolve(process.cwd(), "../frontend/dist");

// Servir os ficheiros estáticos do frontend
app.use(express.static(frontendPath));
// GET /api/alive - Verificar se o servidor está ativo
app.get("/api/alive", (req, res) => {
  res.status(200).json({
    message: "Servidor backend está vivo e a responder a pedidos!",
    status: "ok",
    timestamp: new Date().toISOString(),
    preview: "Servidor backend",
  });
});
// Registar as rotas dos suplementos com o prefixo /api
app.use("/api", supplementsRouter);

export { app };
