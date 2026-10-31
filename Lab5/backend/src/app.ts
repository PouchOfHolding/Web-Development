import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import path from "node:path";
import cors from 'cors';  //trata automaticamente do CORS, permitindo que o frontend aceda ao backend mesmo que estejam em origens diferentes
import compression from "compression";
import supplementsRouter from "./features/supplements/supplements.routes.js";


const app: Express = express();

app.use(cors());// middleware que gere o protocolo CORS automaticamente, permitindo que o frontend aceda ao backend mesmo que estejam em origens diferentes

app.use((req, res, next) => { 
  if (req.path === "/api/events") {
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
  });
});
// Registar as rotas dos suplementos com o prefixo /api
app.use("/api", supplementsRouter);

export { app };
