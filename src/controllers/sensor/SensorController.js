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
            { location: { name: { contains: search, mode: 'insensitive' } } },
            { parameter: { name: { contains: search, mode: 'insensitive' } } },
        ]
    };

    const totalData = await prisma.environmentSensor.count({ where: whereCondition });

    const sensors = await prisma.environmentSensor.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: {
            location: true,
            parameter: true,
        },
        orderBy: { recordedAt: "desc" },
    });

    const sensorsWithNo = sensors.map((sensor, index) => ({
        no: skip + index + 1,
        id: sensor.id,
        location: sensor.location.name,
        parameter: sensor.parameter.name,
        unit: sensor.parameter.unit,
        value: sensor.value,
        recordedAt: sensor.recordedAt,
        createdAt: sensor.createdAt,
        updatedAt: sensor.updatedAt,
    }));

    res.status(200).json({
        success: true,
        message: "Get all data successfully",
        currentPage: page,
        totalData,
        totalPages: Math.ceil(totalData / limit),
        data: sensorsWithNo,
    });
});

const getSensorById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const sensor = await prisma.environmentSensor.findUnique({
        where: { id: parseInt(id) },
        include: { location: true, parameter: true }
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
        data: {
            id: sensor.id,
            location: sensor.location.name,
            parameter: sensor.parameter.name,
            unit: sensor.parameter.unit,
            value: sensor.value,
            recordedAt: sensor.recordedAt,
            createdAt: sensor.createdAt,
            updatedAt: sensor.updatedAt,
        },
    });
});

const createSensor = asyncHandler(async (req, res) => {
    const { locationId, parameterId, value, recordedAt } = req.body;

    const location = await prisma.location.findUnique({ where: { id: locationId } });
    const parameter = await prisma.parameter.findUnique({ where: { id: parameterId } });

    if (!location || !parameter) {
        return res.status(400).json({
            success: false,
            message: "Invalid locationId or parameterId",
        });
    }

    const sensor = await prisma.environmentSensor.create({
        data: {
            locationId,
            parameterId,
            value: parseFloat(value),
            recordedAt: new Date(recordedAt),
        },
        include: { location: true, parameter: true },
    });

    res.status(201).json({
        success: true,
        message: 'Sensor data created successfully',
        data: {
            id: sensor.id,
            location: sensor.location.name,
            parameter: sensor.parameter.name,
            unit: sensor.parameter.unit,
            value: sensor.value,
            recordedAt: sensor.recordedAt,
            createdAt: sensor.createdAt,
            updatedAt: sensor.updatedAt,
        }
    });
})

const updateSensor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { locationId, parameterId, value, recordedAt } = req.body;

    const location = await prisma.location.findUnique({ where: { id: locationId } });
    const parameter = await prisma.parameter.findUnique({ where: { id: parameterId } });

    if (!location || !parameter) {
        return res.status(400).json({
            success: false,
            message: "Invalid locationId or parameterId",
        });
    }

    const sensor = await prisma.environmentSensor.update({
        where: { id: parseInt(id) },
        data: {
            locationId,
            parameterId,
            value: parseFloat(value),
            recordedAt: new Date(recordedAt),
        },
        include: { location: true, parameter: true }
    });

    res.status(200).json({
        success: true,
        message: 'Sensor data updated successfully',
        data: {
            id: sensor.id,
            location: sensor.location.name,
            parameter: sensor.parameter.name,
            unit: sensor.parameter.unit,
            value: sensor.value,
            recordedAt: sensor.recordedAt,
            createdAt: sensor.createdAt,
            updatedAt: sensor.updatedAt,
        }
    });
});

const deleteSensor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.environmentSensor.delete({
        where: { id: parseInt(id) },
    });

    res.status(200).json({
        success: true,
        message: 'Sensor data deleted successfully',
    });
});

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

const getParameters = asyncHandler(async (req, res) => {
    const parameters = await prisma.parameter.findMany({
        orderBy: { id: 'asc' },
    });

    res.status(200).json({
        success: true,
        message: "Get all parameters",
        data: parameters,
    });
});

module.exports = { getAllSensor, getSensorById, createSensor, updateSensor, deleteSensor, getLocations, getParameters }