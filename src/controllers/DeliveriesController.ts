import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { z } from "zod"

class DeliveriesController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            user_id: z.string().uuid(),
            description: z.string()
        })

        const { description, user_id } = bodySchema.parse(request.body)

        await prisma.delivery.create({
            data: {
                userId: user_id,
                description
            }            
        })

        return response.status(201).json()
    }

    async index(request: Request, response: Response) {
        const listDeliveries = await prisma.delivery.findMany({
            include: {
                users: { select: { name: true, email: true } }
            }
        })

        return response.json(listDeliveries)
    }
}

export { DeliveriesController }