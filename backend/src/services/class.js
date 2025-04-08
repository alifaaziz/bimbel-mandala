import { prisma } from '../utils/db.js';
import crypto from 'crypto';

/**
 * Creates a new class.
 *
 * @async
 * @function createClass
 * @param {Object} data - The class data.
 * @returns {Promise<Object>} The created class.
 */
async function createClass(data) {
    const { orderId } = data;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            bimbelPackage: true
        }
    });

    if (!order) {
        throw new Error('Order not found');
    }

    const studentId = order.userId; 
    const tutorId = order.bimbelPackage.userId;

    const code = crypto.randomBytes(3).toString('hex').toUpperCase();

    const newClass = await prisma.class.create({
        data: {
            code,
            orderId,
            tutorId
        }
    });

    await prisma.studentClass.createMany({
        data: [
            { userId: studentId, classId: newClass.id },
        ]
    });

    return newClass;
}

/**
 * Allows a user to join a class using a code.
 *
 * @async
 * @function joinClass
 * @param {Object} data - The join class data.
 * @returns {Promise<Object>} The joined class.
 */
async function joinClass(data) {
    const { code, userId } = data;
  
    const classData = await prisma.class.findUnique({
      where: { code }
    });
  
    if (!classData) {
      throw new Error('Class not found');
    }
  
    const existingStudent = await prisma.studentClass.findFirst({
      where: {
        userId,
        classId: classData.id
      }
    });
  
    if (existingStudent) {
      throw new Error('User is already in the class');
    }
  
    // Add the user to the student_class table
    const studentClass = await prisma.studentClass.create({
      data: {
        userId,
        classId: classData.id
      }
    });
  
    return studentClass;
  }
  
  export const ClassService = {
    createClass,
    joinClass
  };