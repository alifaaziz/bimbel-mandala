import { AttendanceService } from "../services/attendance.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { readFile } from 'fs/promises';
import path from "path";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";

/**
 * Handles attendance with status "masuk".
 *
 * @async
 * @function absenMasuk
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the created attendance record.
 */
async function absenMasuk(req, res) {
    const { scheduleId } = req.body; 
    const userId = res.locals.user.id;

    const attendance = await AttendanceService.createAttendance({
        scheduleId,
        userId,
        status: "masuk",
    });

    await AttendanceService.createMasukNotification({ scheduleId, userId,});

    res.status(201).json({
        message: "Attendance recorded successfully",
        data: attendance,
    });
}

/**
 * Handles attendance with status "izin".
 *
 * @async
 * @function absenIzin
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the created attendance record.
 */
async function absenIzin(req, res) {
    const { scheduleId, reason } = req.body;
    const userId = res.locals.user.id;

    if (!reason) {
        return res.status(400).json({ message: "Reason is required for izin" });
    }

    const attendance = await AttendanceService.createAttendance({
        scheduleId,
        userId,
        status: "izin",
        reason,
    });

    await AttendanceService.createIzinNotification({ scheduleId, userId, reason });

    res.status(201).json({
        message: "Attendance recorded successfully",
        data: attendance,
    });
}

/**
 * Handles the request to mark attendance as 'alpha' for missed schedules.
 *
 * @function markAlphaAttendance
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with a success message.
 */
async function markAlphaAttendance(req, res) {
  await AttendanceService.markAlphaForMissedSchedules();
  res.status(200).json({ message: 'Alpha attendance marked for missed schedules.' });
}

/**
 * Handles the request to get attendance statistics for a class.
 *
 * @async
 * @function getAttendanceStatistics
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the attendance statistics for the class.
 */
async function getAttendanceStatistics(req, res) {
    const { classId } = req.params;
    const stats = await AttendanceService.getRekapKelasById(classId);

    res.status(200).json({
        data: stats
    });
}

/**
 * Handles the request to get attendance statistics for the logged-in user.
 *
 * @async
 * @function getMyAttendanceStatistics
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the attendance statistics for the user's classes.
 */
async function getMyAttendanceStatistics(req, res) {
    const user = res.locals.user;
    const stats = await AttendanceService.getMyAttendanceStatistics(user);
    res.status(200).json(stats);
}

/**
 * Handles the request to download rekap PDF for a class.
 *
 * @async
 * @function downloadRekapPDF
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends the generated PDF as a response.
 */
async function downloadRekapPDF(req, res) {
    const { classId } = req.params;

    const rekapData = await AttendanceService.getRekapKelasById(classId);
    rekapData.printDate = new Date().toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short'
    });

    const templatePath = path.resolve("src/utils/emails/template/rekap.html");
    const templateSource = await readFile(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    const html = template(rekapData);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "5mm", bottom: "0mm", left: "15mm", right: "15mm" }
    });
    await browser.close();

    res.setHeader("Content-Disposition", `attachment; filename=rekap-${classId}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.end(pdfBuffer);
}

/**
 * Handles the request to get attendance alerts for a class.
 *
 * @async
 * @function getAttendanceAlerts
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the attendance alerts for the class.
 */
async function getAttendanceAlerts(req, res) {
    const { classId } = req.params;
    const alerts = await AttendanceService.alertAttendance(classId);
    res.status(200).json({ data: alerts });
}

/**
 * Handles the request to get attendance summary for a schedule by slug.
 *
 * @async
 * @function getAttendanceBySlug
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the attendance summary.
 */
async function getAttendanceBySlug(req, res) {
    const { slug } = req.params;
    const summary = await AttendanceService.getAttendanceBySlug(slug);
    res.status(200).json({ data: summary });
}

export const AttendanceController = {
    absenMasuk: asyncWrapper(absenMasuk),
    absenIzin: asyncWrapper(absenIzin),
    markAlphaAttendance: asyncWrapper(markAlphaAttendance),
    getAttendanceStatistics: asyncWrapper(getAttendanceStatistics),
    getMyAttendanceStatistics: asyncWrapper(getMyAttendanceStatistics),
    downloadRekapPDF: asyncWrapper(downloadRekapPDF),
    getAttendanceAlerts: asyncWrapper(getAttendanceAlerts),
    getAttendanceBySlug: asyncWrapper(getAttendanceBySlug),
};