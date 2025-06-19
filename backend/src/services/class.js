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
            bimbelPackage: true,
            groupType: true
        }
    });

    if (!order) {
        throw new Error('Order not found');
    }

    const studentId = order.userId; 
    const tutorId = order.bimbelPackage.userId;
    const maxStudents = order.groupType?.maxStudent;

    const code = crypto.randomBytes(3).toString('hex').toUpperCase();

    const newClass = await prisma.class.create({
        data: {
            code,
            orderId,
            tutorId,
            status: 'berjalan',
            maxStudents
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
      where: { code },
      include: {
        order: {
          include: {
            bimbelPackage: true
          }
        },
        tutor: {
          include: {
            tutors: true
          }
        }
      }
    });
  
    if (!classData) {
      throw new Error('Class not found');
    }

    const studentCount = await prisma.studentClass.count({
        where: {
            classId: classData.id
        }
    });

    if (studentCount >= classData.maxStudents) {
        throw new Error('Class is full');
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
  
    const studentClass = await prisma.studentClass.create({
      data: {
        userId,
        classId: classData.id
      }
    });

    const bimbelPackage = classData.order?.bimbelPackage;
    const tutorName = getTutorName(classData.tutor);
    const programName = bimbelPackage
      ? `${bimbelPackage.name} ${bimbelPackage.level}`
      : null;

    const studentDescription = `Selamat, Anda telah bergabung pada bimbingan belajar <strong>${programName} #${classData.code}</strong> bersama <strong>${tutorName}</strong>.`;

    await prisma.notification.create({
      data: {
        userId,
        type: 'Program',
        description: studentDescription,
        photo: classData.tutor?.photo
      }
    });

    return studentClass;
}

function getTutorName(tutor) {
    const gender = tutor.tutors?.[0]?.gender;
    const prefix = gender === 'Male' ? 'Pak' : 'Bu';
    return `${prefix} ${tutor.name}`;
}

/**
 * Retrieves the classes for the logged-in user.
 *
 * @async
 * @function getMyClass
 * @param {string} userId - The ID of the logged-in user.
 * @returns {Promise<Array>} The list of classes with detailed information.
 */
async function getMyClass(userId, role) {
    if (role === 'tutor') {
        // Untuk tutor: ambil class di mana tutorId = userId
        const classes = await prisma.class.findMany({
            where: { tutorId: userId },
            include: {
                order: {
                    include: {
                        groupType: { select: { type: true } },
                        bimbelPackage: {
                            include: {
                                packageDay: {
                                    select: {
                                        day: { select: { daysName: true } }
                                    }
                                }
                            }
                        }
                    }
                },
                tutor: {
                    select: {
                        name: true,
                        tutors: { select: { gender: true } }
                    }
                }
            }
        });

        return classes.map(cls => {
            const bimbelPackage = cls.order?.bimbelPackage;
            const groupType = cls.order?.groupType;
            const packageDays = bimbelPackage?.packageDay;

            const tutorName = getTutorName(cls.tutor);

            const programName = bimbelPackage
                ? `${bimbelPackage.name} ${bimbelPackage.level}`
                : null;

            const slug = bimbelPackage?.slug || null;

            const days = packageDays
                ? packageDays.map(day => day.day.daysName).join(', ')
                : null;

            return {
                status: cls.status,
                tutorName,
                programName,
                slug,
                groupType: groupType?.type || null,
                days,
                time: bimbelPackage?.time || null,
                duration: bimbelPackage?.duration || null
            };
        });
    } else {
        // Untuk siswa: ambil dari studentClass
        const studentClasses = await prisma.studentClass.findMany({
            where: { userId },
            include: {
                class: {
                    include: {
                        order: {
                            include: {
                                groupType: { select: { type: true } },
                                bimbelPackage: {
                                    include: {
                                        packageDay: {
                                            select: {
                                                day: { select: { daysName: true } }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        tutor: {
                            select: {
                                name: true,
                                tutors: { select: { gender: true } }
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

            const tutorName = getTutorName(cls.tutor);

            const programName = bimbelPackage
                ? `${bimbelPackage.name} ${bimbelPackage.level}`
                : null;

            const slug = bimbelPackage?.slug || null;

            const days = packageDays
                ? packageDays.map(day => day.day.daysName).join(', ')
                : null;

            return {
                status: cls.status,
                tutorName,
                programName,
                slug,
                groupType: groupType?.type || null,
                days,
                time: bimbelPackage?.time || null,
                duration: bimbelPackage?.duration || null
            };
        });
    }
}

export const ClassService = {
    createClass,
    joinClass,
    getMyClass
};