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

/**
 * Retrieves the classes for the logged-in user.
 *
 * @async
 * @function getMyClass
 * @param {string} userId - The ID of the logged-in user.
 * @returns {Promise<Array>} The list of classes with detailed information.
 */
async function getMyClass(userId) {
    const studentClasses = await prisma.studentClass.findMany({
        where: {
            userId
        },
        include: {
            class: {
                include: {
                    order: {
                        include: {
                            groupType:{
                                select: {
                                    type: true
                                }
                            },
                            bimbelPackage: {
                                include: {
                                    packageDay: {
                                        select: {
                                            day: {
                                                select: {
                                                    daysName: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    tutor: {
                        select: {
                            name: true,
                            tutors: {
                                select: {
                                    gender: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return studentClasses.map(studentClass => {
        const cls = studentClass.class;
        const bimbelPackage = cls.order?.bimbelPackage;
        const groupType = cls.order?.groupType;
        const packageDays = bimbelPackage?.packageDay;

        const tutorName = cls.tutor
            ? `${cls.tutor.tutors[0]?.gender === 'Male' ? 'Pak' : 'Bu'} ${cls.tutor.name}`
            : null;

        const programName = bimbelPackage
            ? `${bimbelPackage.name} ${bimbelPackage.level}`
            : null;

        const days = packageDays
            ? packageDays.map(day => day.day.daysName).join(', ')
            : null;

        return {
            status: cls.status,
            tutorName,
            programName,
            groupType: groupType?.type || null,
            days,
            time: bimbelPackage?.time || null,
            duration: bimbelPackage?.duration || null
        };
    });
}

export const ClassService = {
    createClass,
    joinClass,
    getMyClass
};