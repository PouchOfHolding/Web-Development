import type { Request, Response, NextFunction } from "express";
import {Ajv,  type Schema } from "ajv";
import addFormats from "ajv-formats";

// 3.2: Instanciação otimizada do AJV (criada apenas uma vez no arranque do ficheiro)
const ajv = new Ajv({ allErrors: true });
addFormats.default(ajv);

export const validateSchema = (schema: Schema) => {
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    if (validate(req.body)) {
      next();
    } else {
      res.status(400).json({
        error: "Dados inválidos",
        details: validate.errors,
      });
    }
  };


};


