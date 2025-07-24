const express = require("express");
const prisma = require("../../../prisma/client");
const asyncHandler = require('../../utils/handlers/asyncHandler');
const validationResult = require("express-validator").validationResult;
const bcrypt = require("bcryptjs");

const getAllUser = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const whereCondition = {
        OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ]
    }

    const totalData = await prisma.user.count({ where: whereCondition })

    const users = await prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: "asc" }
    });

    const usersWithNo = users.map((user, index) => ({
        no: skip + index + 1,
        ...user
    }));

    res.status(200).json({
        success: true,
        message: "Get all users successfully",
        currentPage: page,
        totalData,
        totalPages: Math.ceil(totalData / limit),
        data: usersWithNo,
    });
})

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Get user successfully",
        data: user,
    });
})

const createUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
        },
    });

    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
        success: true,
        message: "Register successfully",
        data: userWithoutPassword,
    });
})

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    let updateData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.body.password) {
        updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
    });

    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: userWithoutPassword,
    });
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.user.delete({
        where: { id },
    });

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
})

module.exports = { getAllUser, getUserById, createUser, updateUser, deleteUser };