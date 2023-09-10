import mongoose from 'mongoose'

import dotEnvExtended from 'dotenv-extended';
dotEnvExtended.load(); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI!)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB