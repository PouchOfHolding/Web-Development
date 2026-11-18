import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersRepository } from "../users/users.repository.js";

const router = Router();
const usersRepository = new UsersRepository();
const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_book_store_2026";

/**
 * Passo 4: Rota POST /api/auth/register
 * Regista um novo utilizador encriptando a password com bcrypt.
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validar campos obrigatórios
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Os campos name, email, password e role são obrigatórios." });
    }

    // 2. Verificar se o email já se encontra registado
    const existingUser = await usersRepository.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "O email já se encontra registado." });
    }

    // 3. Gerar a hash de password segura usando bcrypt (custo/salt 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Guardar a nova conta no NeDB
    const newUser = await usersRepository.create({
      name,
      email,
      passwordHash,
      role,
    });

    // 5. Responder com status 201 Created (sem expor a hash da password)
    const userId = newUser._id || newUser.id;
    return res.status(201).json({
      message: "Utilizador registado com sucesso",
      user: {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor ao registar utilizador." });
  }
});

/**
 * Passo 5: Rota POST /api/auth/login
 * Autentica o utilizador e emite o token JWT.
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validar presença de email e password
    if (!email || !password) {
      return res.status(400).json({ error: "Email e password são obrigatórios." });
    }

    // 2. Verificar a existência do utilizador
    const user = await usersRepository.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 3. Comparar a palavra-passe recebida com a hash guardada
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 4. Gerar o Token JWT assinado (validade de 15 minutos)
    const userId = user._id || user.id;
    const token = jwt.sign(
      { id: userId, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 5. Responder com status 200 OK devolvendo o token de acesso
    return res.status(200).json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor ao efetuar login." });
  }
});

export default router;