import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { string, z } from "zod";


class DeliveryLogsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            delivery_id: z.string().uuid(),
            description: z.string()
        })

        const { delivery_id, description } = bodySchema.parse(request.body)
        
        const delivery = await prisma.delivery.findUnique({ where: { id: delivery_id } })

        if (!delivery) {
            throw new AppError("Entrega não encontrada.", 401)
        }

        if (delivery.status === 'delivered') {
            throw new AppError("O pedido já foi entregue.")
        }

        if (delivery.status === 'processing') {
            throw new AppError("O pedido ainda não saiu para entrega.")
        }

        await prisma.deliveryLogs.create({
            data: {
                deliveryId: delivery_id,
                description
            }
        })

        return response.status(200).json()
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            delivery_id: string().uuid()
        })

        const { delivery_id } = paramsSchema.parse(request.params)

        const delivery = await prisma.delivery.findUnique({
            where: {
                id: delivery_id
            },
            include: {
                logs: { select: {description: true, deliveryId: true} },
                users: { select: { name: true, email: true } }
            }
        })

        if (request.user?.role === 'customer' && request.user.id !== delivery?.userId) {
            throw new AppError("O usuário pode visualizar somente o histórico de seus pedidos.", 401)
        }

        return response.json(delivery)
    }
}

export { DeliveryLogsController }