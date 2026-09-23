import dotenv from 'dotenv';

dotenv.config();

if(!process.env.DATABASE_URL){
    throw new Error('DATABASE_URL is not defined in the environment variables')
}

if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET is not defined in the environment variables')
}
export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'developement',
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET 
}