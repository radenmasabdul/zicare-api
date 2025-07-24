const express = require("express");
const prisma = require("../../../prisma/client");
const asyncHandler = require('../../utils/handlers/asyncHandler');
const validationResult = require("express-validator").validationResult;

const getAllSensor = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const whereCondition = {
        OR: [
            { location: { contains: search, mode: 'insensitive' } },
            { parameter: { contains: search, mode: 'insensitive' } }
        ]
    }

    const totalData = await prisma.environmentSensor.count({ where: whereCondition })

    const sensors = await prisma.environmentSensor.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: {
            id: true,
            location: true,
            parameter: true,
            value: true,
            unit: true,
            recordedAt: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: "desc" }
    })

    const sensorsWithNo = sensors.map((sensor, index) => ({
        no: skip + index + 1,
        ...sensor
    }));

    res.status(200).json({
        success: true,
        message: "Get all data successfully",
        currentPage: page,
        totalData,
        totalPages: Math.ceil(totalData / limit),
        data: sensorsWithNo,
    });
})

module.exports = { getAllSensor }