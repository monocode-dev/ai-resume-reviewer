import pool from "./database";

async function dbMigrate() {
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                signup_ip TEXT,
                plan TEXT NOT NULL DEFAULT 'free',
                used_today INTEGER NOT NULL DEFAULT 0,
                usage_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )`);
    
        console.log("Migration completed");
    } catch (err){
        console.error("Migration failed", err);
    } finally {
        await pool.end(); 
    }
}

dbMigrate();