import jwt from 'jsonwebtoken'
import dotEnvExtended from 'dotenv-extended';
dotEnvExtended.load(); 

const verifyJWT = (req:any, res:any, next:any) => {
    const authHeader:any = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err:any, decoded:any) => {
            
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.userId = decoded.UserInfo.userId
            req.role = decoded.UserInfo.role
            next()
        }
    )
}

export default verifyJWT 