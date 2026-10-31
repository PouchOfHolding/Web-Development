import { Router } from "express";
import { SupplementsRepository } from "./supplements.repository.js";
import { SupplementCategory } from "../../../../shared/types.js";

import type { Request, Response } from 'express';
import type { Supplement } from "../../../../shared/types.js";

import { validateSchema } from "../../middlewares/validation.middleware.js";
import { supplementValidationSchema } from "./supplements.schema.js";

const router = Router();
const supplementsRepository = new SupplementsRepository();

// GET /api/supplements - Listar todos os suplementos
router.get("/supplements", async (req, res) => {
  try {
    const supplements = await supplementsRepository.getAll();

    res.status(200).json(supplements);
  } catch (error) {
    console.error("Erro ao obter suplementos:", error);

    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
});
// GET /api/supplements/:id - Consultar suplemento por ID
router.get("/supplements/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const supplement = await supplementsRepository.getById(id);

    if (!supplement) {
      res.status(404).json({
        error: "Suplemento não encontrado",
      });
      return;
    }

    res.status(200).json(supplement);
  } catch (error) {
    console.error("Erro ao procurar suplemento:", error);

    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
});
// POST /api/supplements - Adicionar um suplemento  //MUDANÇA COM AVJ LAB5
router.post(
  "/supplements",
  validateSchema(supplementValidationSchema), //AJV
  async (req, res) => {
  try {
    const { name, laboratory, price, category, stock, description } = req.body;

    const newSupplement: Supplement = {
        id: `sup-${Date.now()}`,
        name,
        laboratory,
        price,
        category: category as SupplementCategory,
        stock,
        description: description ?? "",
      };

    const createdSupplement = await supplementsRepository.create(newSupplement);
    res.status(201).json(createdSupplement);

  } catch (error) {
    console.error("Erro ao criar suplemento:", error);

    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
});
// PUT /api/supplements/:id - Atualizar um suplemento
router.put("/supplements/:id", 
  validateSchema(supplementValidationSchema),  //Validação AJV
  async (req, res) => {
  try {
    const id = req.params.id as string;

    const { name, laboratory, price, category, stock, description } = req.body;

    const updatedSupplement = await supplementsRepository.update(id, {
        name,
        laboratory,
        price,
        category,
        stock,
        description,
      });

  

    if (!updatedSupplement) {
      res.status(404).json({
        error: "Suplemento não encontrado",
      });
      return;
    }

    res.status(200).json(updatedSupplement);
  } catch (error) {
    console.error("Erro ao atualizar suplemento:", error);

    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
});
// DELETE /api/supplements/:id - Eliminar um suplemento
router.delete("/supplements/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await supplementsRepository.delete(id);

    if (!deleted) {
      res.status(404).json({
        error: "Suplemento não encontrado",
      });
      return;
    }

    // Sucesso, sem conteúdo na resposta
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao eliminar suplemento:", error);

    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
});

// GET /api/events - Canal Server-Sent Events
router.get("/events", (req, res) => {
  console.log("SSE: novo cliente ligado");
  console.log("Origem:", req.headers.origin);
  // Configurar a resposta SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();
  res.socket?.setNoDelay(true);
  // Confirmar que a ligação foi estabelecida
  res.write(
    `data: ${JSON.stringify({
      message: "Ligação SSE estabelecida",
    })}\n\n`,
  );
  console.log("SSE: primeira mensagem enviada");
  // Enviar uma notificação de 5 em 5 segundos
  const interval = setInterval(async () => {
    try {
      const supplements = await supplementsRepository.getAll();

      if (supplements.length === 0) return;

      const supplement =
        supplements[Math.floor(Math.random() * supplements.length)];

      const notification = {
        type: "purchase",
        message: `Foi comprado: ${supplement.name}`,
        supplementId: supplement.id,
        timestamp: new Date().toISOString(),
      };

      res.write(`data: ${JSON.stringify(notification)}\n\n`);
      console.log("SSE: notificação enviada:", notification.message);
    } catch (error) {
      console.error("Erro ao enviar evento SSE:", error);
    }
  }, 5000);

  // Limpar o temporizador quando o cliente desligar
  res.on("close", () => {
    clearInterval(interval);
    console.log("Cliente SSE desligado");
  });
});
export default router;