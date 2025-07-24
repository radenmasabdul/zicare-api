const express = require("express");
const prisma = require("../../../prisma/client");
const asyncHandler = require('../../utils/handlers/asyncHandler');

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
        orderBy: { location: "asc" }
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

const getSensorById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const sensor = await prisma.environmentSensor.findUnique({
        where: { id: parseInt(id) },
        select: {
            id: true,
            location: true,
            parameter: true,
            value: true,
            unit: true,
            recordedAt: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if (!sensor) {
        return res.status(404).json({
            success: false,
            message: "Sensor data not found",
        });
    }

    res.status(200).json({
        success: true,
        message: 'Get sensor successfully',
        data: sensor,
    });
})

const createSensor = asyncHandler(async (req, res) => {
    const { location, parameter, value, unit, recordedAt } = req.body;

    const sensor = await prisma.environmentSensor.create({
        data: {
            location,
            parameter,
            value: parseFloat(value),
            unit,
            recordedAt: new Date(recordedAt),
        }
    });

    res.status(201).json({
        success: true,
        message: 'Sensor data created successfully',
        data: sensor,
    });
})

const updateSensor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { location, parameter, value, unit, recordedAt } = req.body;

    const sensor = await prisma.environmentSensor.update({
        where: { id: parseInt(id) },
        data: {
            location,
            parameter,
            value: parseFloat(value),
            unit,
            recordedAt: new Date(recordedAt),
        },
    })

    res.status(200).json({
        success: true,
        message: 'Sensor data updated successfully',
        data: sensor,
    });
})

const deleteSensor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.environmentSensor.delete({
        where: { id: parseInt(id) },
    });

    res.status(200).json({
        success: true,
        message: 'Sensor data deleted successfully',
    });
})

const getLocations = asyncHandler(async (req, res) => {
    const locations = await prisma.location.findMany({
        orderBy: { name: 'asc' },
    });

    res.status(200).json({
        success: true,
        message: "Get all locations",
        data: locations,
    });
});

module.exports = { getAllSensor, getSensorById, createSensor, updateSensor, deleteSensor, getLocations }