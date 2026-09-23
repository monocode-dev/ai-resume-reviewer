import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_CONNECTION_STRING
});

export default pool;

export interface users {
    id: string | number;
    email: string;
    password: string;
    signup_ip: string;
    plan: string;
    used_today: number;
    usage_reset_date: Date;
    created_at: Date;
}