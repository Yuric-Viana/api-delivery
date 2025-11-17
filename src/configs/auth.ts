import { env } from "../env"

export const authConfig = {
    jwt: {
        secret: env.JWT_SECRET,
        expiresIn: 60 * 60 * 24
    }
}