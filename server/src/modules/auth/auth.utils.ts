import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME"
const EXPIRES_IN = process.env.EXPIRES_IN || "7d"

export function signJWT(payload: string | Buffer | object): string {
    return jwt.sign(
        payload, JWT_SECRET, {expiresIn: EXPIRES_IN}
    )
}
export function verifyJWT(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET)

    } catch (error) {
        return null;
    }
}