import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

class UsersController {
    async create (request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(3),
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { name, email, password } = bodySchema.parse(request.body)

        const emailAlreadyExists = await prisma.user.findFirst({ where: {email} })

        if (emailAlreadyExists) {
            throw new AppError("O e-mail informado já está cadastrado.")
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }            
        })

        const { password: _, ...userWithoutPassword } = user

        return response.status(201).json(userWithoutPassword)
    }
}

export { UsersController }
