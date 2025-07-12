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

    if (code.startsWith('CLS')) {
        throw new Error('You cannot join this class manually.');
    }
  
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
                duration: bimbelPackage?.duration || null,
                code: cls.code
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
                duration: bimbelPackage?.duration || null,
                code: cls.code
            };
        });
    }
}

/**
 * Retrieves all running classes.
 *
 * @async
 * @function getRunningClass
 * @returns {Promise<Array>} The list of running classes with tutor and program information.
 */
async function getRunningClass() {
    const runningClasses = await prisma.class.findMany({
        where: {
            status: 'berjalan',
        },
        include: {
            tutor: {
                select: {
                    name: true,
                },
            },
            order: {
                include: {
                    bimbelPackage: {
                        select: {
                            name: true,
                            level: true,
                        },
                    },
                },
            },
        },
    });

    return runningClasses.map((cls) => ({
        tutorName: cls.tutor?.name || 'Tidak ada tutor',
        programName: cls.order?.bimbelPackage?.name || 'Tidak ada program',
        level: cls.order?.bimbelPackage?.level || 'Tidak ada level',
        classCode: cls.code,
    }));
}

/**
 * Get all class details for a student by userId
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getStudentClassesByUserId(userId) {
    const studentClasses = await prisma.studentClass.findMany({
        where: { userId },
        include: {
            class: {
                select: {
                    status: true,
                    code: true,
                    tutor: {
                        select: { name: true }
                    },
                    order: {
                        select: {
                            groupType: { select: { type: true } },
                            bimbelPackage: {
                                select: {
                                    name: true,
                                    level: true,
                                    time: true,
                                    duration: true,
                                    packageDay: {
                                        select: {
                                            day: { select: { daysName: true } }
                                        }
                                    }
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

        return {
            programName: bimbelPackage?.name || null,
            level: bimbelPackage?.level || null,
            tutorName: cls.tutor?.name || null,
            status: cls.status,
            groupType: groupType?.type || null,
            days: packageDays ? packageDays.map(day => day.day.daysName).join(', ') : null,
            time: bimbelPackage?.time || null,
            duration: bimbelPackage?.duration || null,
            code: cls.code
        };
    });
}

/**
 * Retrieves all finished classes with detailed info.
 *
 * @async
 * @function getFinishedClasses
 * @returns {Promise<Array>} The list of finished classes with details.
 */
async function getFinishedClasses() {
    const finishedClasses = await prisma.class.findMany({
        where: { status: 'selesai' },
        include: {
            tutor: {
                select: { name: true }
            },
            order: {
                select: {
                    address: true,
                    groupType: {
                        select: {
                            type: true,
                            price: true,
                            discPrice: true,
                            maxStudent: true
                        }
                    },
                    bimbelPackage: {
                        select: {
                            name: true,
                            level: true,
                            time: true,
                            duration: true,
                            packageDay: {
                                select: {
                                    day: { select: { daysName: true } }
                                }
                            }
                        }
                    },
                    salary: { 
                        select: {
                            total: true,
                            status: true
                        }
                    }
                }
            },
            studentClasses: {
                include: {
                    user: { select: { name: true } }
                }
            }
        }
    });

    return finishedClasses.map(cls => {
        const bimbelPackage = cls.order?.bimbelPackage;
        const groupType = cls.order?.groupType;
        const packageDays = bimbelPackage?.packageDay;
        const students = cls.studentClasses?.map(sc => sc.user?.name) || [];
        const price = groupType?.discPrice ?? groupType?.price ?? 0;
        const maxStudent = groupType?.maxStudent ?? 1;
        const studentPrice = price && maxStudent ? Number(price) / Number(maxStudent) : 0;
        const salary = Array.isArray(cls.order?.salary) && cls.order.salary.length > 0
            ? cls.order.salary[0]
            : { total: 0, status: null };

        return {
            programName: bimbelPackage?.name || null,
            tutorName: cls.tutor?.name || null,
            level: bimbelPackage?.level || null,
            days: packageDays ? packageDays.map(day => day.day.daysName).join(', ') : null,
            time: bimbelPackage?.time || null,
            address: cls.order?.address || null,
            status: cls.status,
            students,
            groupType: {
                type: groupType?.type || null,
                price: groupType?.discPrice ?? groupType?.price ?? null,
                maxStudent,
                studentPrice
            },
            salary: {
                total: salary.total || 0,
                status: salary.status || null
            }
        };
    });
}

/**
 * Get a class detail by classId
 * @param {string} classId
 * @returns {Promise<Object>}
 */
async function getClassById(classId) {
    const cls = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            studentClasses: {
                include: {
                    user: { select: { name: true } }
                }
            },
            order: {
                include: {
                    groupType: {
                        select: {
                            type: true,
                            price: true,
                            discPrice: true,
                            maxStudent: true
                        }
                    },
                    bimbelPackage: {
                        select: {
                            name: true,
                            level: true,
                            area: true,
                            time: true,
                            duration: true,
                            user: {
                                select: {
                                    name: true,
                                    tutors: { select: { photo: true } } // ← gunakan select, bukan include
                                }
                            },
                            packageDay: {
                                select: {
                                    day: { select: { daysName: true } }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!cls) return null;

    const bimbelPackage = cls.order?.bimbelPackage;
    const groupType = cls.order?.groupType;
    const packageDays = bimbelPackage?.packageDay;

    const price = groupType?.discPrice && Number(groupType.discPrice) > 0
        ? Number(groupType.discPrice)
        : Number(groupType?.price) || 0;
    const maxStudent = groupType?.maxStudent || 1;
    const honor = price * 0.9;
    const studentPrice = maxStudent ? price / maxStudent : 0;
    const students = cls.studentClasses.map(sc => sc.user.name).join(', ');

    return {
        classId: cls.id,
        code: cls.code,
        packageName: bimbelPackage?.name || null,
        level: bimbelPackage?.level || null,
        tutorName: bimbelPackage?.user?.name || null,
        tutorPhoto: bimbelPackage?.user?.tutors?.[0]?.photo || null,
        days: packageDays ? packageDays.map(day => day.day.daysName) : [],
        area: bimbelPackage?.area || null,
        time: bimbelPackage?.time || null,
        duration: bimbelPackage?.duration || null,
        type: groupType?.type || null,
        price,
        studentPrice,
        honor,
        address: cls.order?.address || null,
        students
    };
}

export const ClassService = {
    createClass,
    joinClass,
    getMyClass,
    getRunningClass,
    getStudentClassesByUserId,
    getFinishedClasses,
    getClassById
};