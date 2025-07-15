import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { AuthService } from './auth.js';
import { OtpService } from './otp.js';
import { savePhoto } from '../utils/helper.js';

/**
 * Creates a new user.
 *
 * @async
 * @function createUser
 * @param {Object} payload - The user payload.
 * @param {string} payload.name - The user's name.
 * @param {string} payload.email - The user's email.
 * @param {string} payload.password - The user's password.
 * @param {string} payload.role - The user's role.
 * @param {string} payload.googleId - The user's Google ID.
 * @returns {Promise<Object>} The new user object.
 * @throws {HttpError} Throws an error if the user creation fails.
 */
async function createStudent(payload, options = {}) {
    const encryptedPassword = payload.password ? await AuthService.hashPassword(payload.password) : null;

    const parsedUserWithEncryptedPassword = {
        name: payload.name,
        email: payload.email,
        password: encryptedPassword,
        role: payload.role,
        googleId: payload.googleId || null,
        ...(options.skipOtp ? { verified: true } : {})
    };
    

    const verifiedUser = await prisma.user.findFirst({
        where: {
          email: payload.email,
          verified: true
        }
      });

    if (verifiedUser) {
        let errorMessage = 'Email already exists';
        throw new HttpError(409, { message: errorMessage });
    }

    let user = null;

    const unverifiedUser = await prisma.user.findFirst({
        where: {
          email: payload.email,
          verified: false
        }
      });

    if (unverifiedUser) {
        let errorMessage = 'Email already exists but not verified';
        throw new HttpError(409, { message: errorMessage });
    } else {
        const newUser = await prisma.user.create({
            data: parsedUserWithEncryptedPassword
        });
        user = newUser;
    }

    await prisma.student.create({
        data: {
            userId: user.id,
            level: payload.level || null,
            address: payload.address || null,
            phone: payload.phone || null,
            parentPhone: payload.parentPhone || null,
        }
    });

    if (!options.skipOtp) {

        await OtpService.sendUserVerificationOtp(user.name, user.email, user.id);
    }
    return user;
}

/**
 * Creates a new user with a role.
 * 
 * @async
 * @function createUserWithRole
 * @param {Object} payload - The user payload.
 * @param {string} payload.name - The user's name.
 * @param {string} payload.email - The user's email.
 * @param {string} payload.password - The user's password.
 * @param {string} payload.role - The user's role.
 * @param {Object} payload.tutorData - The tutor data.
 * @returns {Promise<Object>} The new user object.
 * @throws {HttpError} Throws an error if the user creation fails.
 */
async function createUserWithRole(payload, file) {
    const { name, email, password, role, days, ...additionalData } = payload;

    if (role !== 'tutor' && role !== 'admin') {
        throw new HttpError(400, { message: 'Invalid role for this function' });
    }

    const encryptedPassword = await AuthService.hashPassword(password);

    const parsedUserWithEncryptedPassword = {
        name,
        email,
        password: encryptedPassword,
        role,
        googleId: payload.googleId || null,
        verified: true 
    };

    let user = await prisma.user.findFirst({
        where: { email }
    });

    if (user) {
        throw new HttpError(409, { message: 'Email already exists' });
    }

    if (file) {
        const photoPath = await savePhoto(file, name || 'tutor');
        additionalData.photo = photoPath;
    }

    const newUser = await prisma.user.create({
        data: {
            ...parsedUserWithEncryptedPassword,
            role
        }
    });

    user = newUser;

    let tutor;
    if (role === 'tutor') {
        // Simpan days sebagai JSON string
        if (Array.isArray(days)) {
            additionalData.days = JSON.stringify(days);
        }
        tutor = await prisma.tutor.create({
            data: {
                userId: user.id,
                ...additionalData,
                percent: 60
            }
        });

        await prisma.notification.create({
            data: {
                userId: user.id,
                type: 'Pendaftaran Akun',
                description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
                photo: '/public/mandala.png'
            }
        });
    }

    return user;
}

/**
 * Updates a user.
 * 
 * @async
 * @function updateUser
 * @param {Object} payload - The user payload.
 * @param {string} payload.id - The user's ID.
 * @param {string} [payload.name] - The user's name.
 * @param {string} [payload.email] - The user's email.
 * @param {string} [payload.password] - The user's password.
 * @param {string} [payload.role] - The user's role.
 * @param {string} [payload.googleId] - The user's Google ID.
 * @param {Object} [additionalData] - Additional data for the user.
 * @returns {Promise<Object>} The updated user object.
 * @throws {Error} Throws an error if the update fails.
 */
async function updateUser(payload, file) {
    const { id, password, role, daysName, ...additionalData } = payload;
    const encryptedPassword = password ? await AuthService.hashPassword(password) : null;

    if (file) {
        let userName = additionalData.name;
        if (!userName) {
            const userDb = await prisma.user.findUnique({ where: { id } });
            userName = userDb?.name || id || 'tutor';
        }
        const photoPath = await savePhoto(file, userName);
        additionalData.photo = photoPath;
    }

    const { name, email, googleId, password: userPassword, ...maybeTutorData } = additionalData;

    if (name || email || googleId || userPassword) {
        await prisma.user.update({
            where: { id: id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(googleId && { googleId }),
                ...(userPassword && { password: userPassword })
            }
        });
    }

    if (role === 'siswa') {
        const studentData = Object.fromEntries(
            Object.entries(maybeTutorData).filter(([_, v]) => v !== null && v !== undefined)
        );
        await prisma.student.update({
            where: { userId: id },
            data: studentData
        });
    } else if (role === 'tutor') {
        const allowedTutorFields = [
            'status', 'school', 'phone', 'address', 'teachLevel', 'subjects', 'major', 'description', 'photo', 'percent'
        ];
        const tutorData = Object.fromEntries(
            Object.entries(maybeTutorData)
                .filter(([k, v]) => allowedTutorFields.includes(k) && v !== null && v !== undefined)
        );
        // Simpan daysName sebagai JSON string di kolom days
        if (Array.isArray(daysName)) {
            tutorData.days = JSON.stringify(daysName);
        }
        await prisma.tutor.update({
            where: { userId: id },
            data: tutorData
        });
    }

    const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
            students: true,
            tutors: true
        }
    });

    return user;
}

/**
 * Retrieves tutors sorted by the number of classes they are associated with, with pagination.
 *
 * @async
 * @function getTutorsSortedByClassCount
 * @param {Object} [options] - Pagination options.
 * @param {number} [options.page=1] - Page number (1-based).
 * @param {number} [options.pageSize=10] - Number of items per page.
 * @returns {Promise<Object>} The paginated list of tutors and total count.
 */
async function getTutorsSortedByClassCount({ page = 1, pageSize = 10 } = {}) {
    const skip = (page - 1) * pageSize;

    const [tutors, total] = await Promise.all([
        prisma.user.findMany({
            where: { role: 'tutor' },
            select: {
                id: true,
                name: true,
                createdAt: true,
                _count: { select: { class: true } }
            },
            orderBy: { class: { _count: 'desc' } },
            skip,
            take: pageSize
        }),
        prisma.user.count({ where: { role: 'tutor' } })
    ]);

    const tutorDetails = await prisma.tutor.findMany({
        where: { userId: { in: tutors.map(tutor => tutor.id) } },
        select: {
            userId: true,
            subjects: true,
            teachLevel: true,
            description: true,
            photo: true,
            birthDate: true,
            phone: true
        }
    });

    const tutorDetailsMap = tutorDetails.reduce((map, detail) => {
        map[detail.userId] = detail;
        return map;
    }, {});

    function getAge(birthDate) {
        if (!birthDate) return null;
        const today = new Date();
        const dob = new Date(birthDate);
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    return {
        data: tutors.map(tutor => {
            const detail = tutorDetailsMap[tutor.id] || {};
            return {
                id: tutor.id,
                name: tutor.name,
                joinDate: tutor.createdAt,
                subject: detail.subjects || null,
                teachLevel: detail.teachLevel || null,
                description: detail.description || null,
                photo: detail.photo || null,
                classCount: tutor._count.class,
                phone: detail.phone || null,
                age: detail.birthDate ? getAge(detail.birthDate) : null
            };
        }),
        total,
        page,
        pageSize
    };
}

/**
 * Get details of a user by ID.
 *
 * @async
 * @function getUserById
 * @param {string} id - The user's ID.
 * @returns {Promise<Object>} The user object.
*/
async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            students: true,
            tutors: true
        }
    });

    if (!user) {
        throw new HttpError(404, { message: 'User not found' });
    }

    if (user.role === 'tutor' && user.tutors?.length) {
        user.tutors = user.tutors.map(tutor => {
            let daysName = [];
            if (tutor.days) {
                try {
                    daysName = JSON.parse(tutor.days);
                } catch {
                    daysName = [];
                }
            }
            const { days, ...restTutor } = tutor;
            return {
                ...restTutor,
                daysName
            };
        });
    }

    return user;
}

/**
 * Retrieves students ordered by their creation date.
 *
 * @async
 * @function getTopStudents
 * @returns {Promise<Array>} The list of students ordered by creation date, including level and class count.
 */
async function getTopStudents() {
    const students = await prisma.user.findMany({
        where: {
            role: 'siswa'
        },
        select: {
            id: true,
            name: true,
            students: {
                select: {
                    level: true
                }
            },
            _count: {
                select: {
                    studentClass: true
                }
            }
        },
        orderBy: {
            studentClass: {
                _count: 'desc'
            }
        },
        take: 5
    });

    return students.map(student => ({
        id: student.id,
        name: student.name,
        level: student.students?.[0]?.level || null,
        classCount: student._count?.studentClass || 0,
    }));
}

/**
 * Retrieves the newest students ordered by their creation date, with pagination.
 *
 * @async
 * @function getNewStudents
 * @param {Object} [options] - Pagination options.
 * @param {number} [options.page=1] - Page number (1-based).
 * @param {number} [options.pageSize=10] - Number of items per page.
 * @returns {Promise<Object} The paginated list of newest students and total count.
 */
async function getNewStudents({ page = 1, pageSize = 10 } = {}) {
    const skip = (page - 1) * pageSize;
    const [students, total] = await Promise.all([
        prisma.user.findMany({
            where: {
                role: 'siswa'
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                students: {
                    select: {
                        level: true,
                        phone: true,
                    }
                },
                _count: {
                    select: {
                        studentClass: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: pageSize
        }),
        prisma.user.count({
            where: {
                role: 'siswa'
            }
        })
    ]);

    return {
        data: students.map(student => ({
            id: student.id,
            name: student.name,
            createdAt: student.createdAt,
            level: student.students?.[0]?.level || null,
            phone: student.students?.[0]?.phone || null,
            classCount: student._count?.studentClass || 0,
        })),
        total,
        page,
        pageSize
    };
}

/**
 * Retrieves the 3 newest tutors.
 *
 * @async
 * @function getNewTutors
 * @returns {Promise<Array>} The newest tutors.
 */
async function getNewTutors() {
    const tutors = await prisma.user.findMany({
        where: { role: 'tutor' },
        select: {
            name: true,
            createdAt: true,
            tutors: {
                select: {
                    teachLevel: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    return tutors.map(tutor => ({
        name: tutor.name,
        createdAt: tutor.createdAt,
        teachLevel: tutor.tutors?.[0]?.teachLevel || null
    }));
}

/**
 * Retrieves statistics about tutors, students, and packages.
 *
 * @async
 * @function getStatistics
 * @returns {Promise<Object>} The statistics object.
 */
async function getStatistics() {
  const [tutorCount, studentCount, packageCount, activePackageCount] = await Promise.all([
    prisma.user.count({ where: { role: 'tutor' } }),
    prisma.user.count({ where: { role: 'siswa' } }),
    prisma.bimbelPackage.count(),
    prisma.bimbelPackage.count({ where: { isActive: true } })
  ]);

  return {
    tutorCount,
    studentCount,
    packageCount,
    activePackageCount
  };
}

/**
 * Delete a user and all related data by userId.
 * 
 * @async
 * @function deleteUser
 * @param {string} userId - The user's ID.
 * @returns {Promise<void>}
 */
async function deleteUser(userId) {
    await prisma.studentClass.deleteMany({ where: { userId } });
    await prisma.attendance.deleteMany({ where: { userId } });
    await prisma.student.deleteMany({ where: { userId } });

    await prisma.tutor.deleteMany({ where: { userId } });

    const packages = await prisma.bimbelPackage.findMany({ where: { userId } });
    for (const pkg of packages) {
        const groupTypes = await prisma.groupType.findMany({ where: { packageId: pkg.id } });
        for (const gt of groupTypes) {
            await prisma.order.deleteMany({ where: { groupTypeId: gt.id } });
        }
        await prisma.groupType.deleteMany({ where: { packageId: pkg.id } });

        await prisma.packageDay.deleteMany({ where: { packageId: pkg.id } });

        await prisma.order.deleteMany({ where: { packageId: pkg.id } });

        const orders = await prisma.order.findMany({ where: { packageId: pkg.id } });
        for (const order of orders) {
            await prisma.class.deleteMany({ where: { orderId: order.id } });
        }

        await prisma.class.deleteMany({ where: { tutorId: userId } });

        await prisma.bimbelPackage.delete({ where: { id: pkg.id } });
    }

    await prisma.order.deleteMany({ where: { userId } });
    await prisma.notification.deleteMany({ where: { userId } });
    await prisma.passwordReset.deleteMany({ where: { userId } });
    await prisma.otp.deleteMany({ where: { userId } });
    await prisma.salary.deleteMany({ where: { userId } });

    await prisma.user.delete({ where: { id: userId } });
}

/**
 * Get all tutors (id and name only).
 *
 * @async
 * @function getAllTutors
 * @returns {Promise<Array>} Array of tutors with id and name.
 */
async function getAllTutors() {
    const tutors = await prisma.user.findMany({
        where: { role: 'tutor' },
        select: {
            id: true,
            name: true,
            tutors: {
                select: {
                    days: true
                }
            }
        }
    });

    return tutors.map(tutor => ({
        id: tutor.id,
        name: tutor.name,
        daysName: tutor.tutors?.[0]?.days ? JSON.parse(tutor.tutors[0].days) : []
    }));
}

export const UserService = { 
    createStudent,
    createUserWithRole, 
    updateUser, 
    getTutorsSortedByClassCount,
    getUserById,
    getTopStudents,
    getNewStudents,
    getNewTutors,
    getStatistics,
    deleteUser,
    getAllTutors,
};