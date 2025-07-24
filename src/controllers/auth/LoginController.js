const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../../prisma/client");
const asyncHandler = require('../../utils/handlers/asyncHandler');

const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
        }
    })

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(410).json({
            success: false,
            message: "Invalid password",
        })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: userWithoutPassword,
            token,
        }
    });
})

module.exports = { login }