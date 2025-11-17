import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/configs/auth";
import { verify } from "jsonwebtoken";

interface TokenPayload {
    role: string,
    sub: string
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError("JWT não encontrado.", 401)
        }

        const [, token] = authHeader.split(' ')

        const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPayload

        request.user = {
            id: user_id,
            role
        }

        return next()

    } catch (error) {
        throw new AppError("JWT inválido.", 401)
    }

}