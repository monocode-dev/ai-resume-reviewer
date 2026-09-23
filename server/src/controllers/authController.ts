import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import pool from "../database/database";

export async function signup(req: Request, res: Response) {
    const {email, password} = req.body;
    const ip = req.ip || req.headers['x-forwarded-for']

    if(!email || !password) return res.status(400).json({success: false, message: 'Invalid Credentials!'});

    try {
        const lookForEmail = await pool.query(
            `SELECT 1 FROM users WHERE email = $1`,
            [email]
        );

        if(lookForEmail.rows[0]) return res.status(400).json({success: false, message: 'Invalid Credentials!'});

        const lookForIp = await pool.query(
            `SELECT * FROM users WHERE signup_ip = $1`,
            [ip]
        );

        if(lookForIp.rows.length >= 2) return res.status(400).json({success: false, message: 'Too many Accounts!'});

        const hashedPassword = await bcrypt.hash(password, 10)

        const addUser = await pool.query(
            `INSERT INTO users (email, password, signup_ip) VALUES ($1, $2, $3) RETURNING *`,
            [email, hashedPassword, ip]
        );

        req.session.userId = addUser.rows[0].id;
        req.session.plan = addUser.rows[0].plan;
        return res.status(201).json({success: true, message: 'Account Created!', data: {email: email, plan: req.session.plan}});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Server Error, please try again later...'});
    };
}

export async function login(req: Request, res: Response) {
    const {email, password} = req.body;

    if(!email || !password) return res.status(400).json({success: false, message: 'Invalid Credentials!'});

    try {
        const FindUserByEmail = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        if(!FindUserByEmail.rows[0]) return res.status(400).json({success: false, message: 'Invalid email or password!'});

        const comparepass = await bcrypt.compare(password, FindUserByEmail.rows[0].password)
        if(!comparepass) return res.status(400).json({success: false, message: 'Invalid email or password!'});

        req.session.userId = FindUserByEmail.rows[0].id;
        req.session.plan = FindUserByEmail.rows[0].plan;
        return res.status(200).json({success: true, message: 'Logged In Successfully', data: {email: email, plan: req.session.plan}});

    } catch (error) {
        return res.status(500).json({success: false, message: 'Server Error, please try again later...'});
    };
}

export async function logout(req: Request, res: Response) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({success: false, message: 'Could not Log Out, Please try again'});
        }

        res.clearCookie('connect.sid');
        return res.status(200).json({success: true, message: 'logged out Successfully'});
    })
}