import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { AuthService } from './auth.js';
import { OtpService } from './otp.js';

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
async function createStudent(payload) {
    const { name, email, password, role, googleId } = payload;
    const encryptedPassword = password ? await AuthService.hashPassword(password) : null;

    const parsedUserWithEncryptedPassword = {
        ...payload,
        password: encryptedPassword
    };

    const verifiedUser = await prisma.user.findFirst({
        where: {
          email,
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
          email,
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
        data: { userId: user.id }
    });

    await OtpService.sendUserVerificationOtp(user.name, user.email, user.id);
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
async function createUserWithRole(payload) {
    const { name, email, password, role, ...additionalData } = payload;

    if (role !== 'tutor' && role !== 'admin') {
        throw new HttpError(400, { message: 'Invalid role for this function' });
    }

    const encryptedPassword = await AuthService.hashPassword(password);

    const parsedUserWithEncryptedPassword = {
        name,
        email,
        password: encryptedPassword,
        verified: true
    };

    let user = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (user) {
        let errorMessage = 'Email already exists';
        throw new HttpError(409, { message: errorMessage });
    }

    const newUser = await prisma.user.create({
        data: {
            ...parsedUserWithEncryptedPassword,
            role
        }
    });

    user = newUser;

    if (role === 'tutor') {
        await prisma.tutor.create({
            data: {
                userId: user.id,
                ...additionalData,
            }
        });

        await prisma.notification.create({
            data: {
                userId: user.id,
                type: 'Pendaftaran Akun',
                description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.'
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
async function updateUser(payload) {
    const { id, password, role, ...additionalData } = payload;
    const encryptedPassword = password ? await AuthService.hashPassword(password) : null;

    const parsedUserWithEncryptedPassword = {
        ...additionalData,
        password: encryptedPassword
    };

    Object.keys(parsedUserWithEncryptedPassword).forEach(key => {
        if (parsedUserWithEncryptedPassword[key] === undefined) {
            delete parsedUserWithEncryptedPassword[key];
        }
    });

    const { name, email, googleId, password: userPassword, ...additionalUserData } = parsedUserWithEncryptedPassword;

    if (name || email || googleId || userPassword) {
        await prisma.user.update({
            where: { id: id },
            data: {
                name,
                email,
                googleId,
                password: userPassword
            }
        });
    }

    if (role === 'siswa') {
        await prisma.student.update({
            where: { userId: id },
            data: additionalUserData
        });
    } else if (role === 'tutor') {
        await prisma.tutor.update({
            where: { userId: id },
            data: additionalUserData
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
 * Retrieves tutors sorted by the number of classes they are associated with.
 *
 * @async
 * @function getTutorsSortedByClassCount
 * @returns {Promise<Array>} The list of tutors sorted by class count.
 */
async function getTutorsSortedByClassCount() {
    const tutors = await prisma.user.findMany({
        where: {
            role: 'tutor'
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    class: true // Count the number of classes associated with the tutor
                }
            }
        },
        orderBy: {
            class: {
                _count: 'desc' // Sort by class count in descending order
            }
        }
    });

    const tutorDetails = await prisma.tutor.findMany({
        where: {
            userId: {
                in: tutors.map(tutor => tutor.id)
            }
        },
        select: {
            userId: true,
            subjects: true,
            teachLevel: true,
            description: true,
            photo: true
        }
    });

    const tutorDetailsMap = tutorDetails.reduce((map, detail) => {
        map[detail.userId] = detail;
        return map;
    }, {});

    return tutors.map(tutor => ({
        id: tutor.id,
        name: tutor.name,
        subject: tutorDetailsMap[tutor.id]?.subjects || null,
        teachLevel: tutorDetailsMap[tutor.id]?.teachLevel || null,
        description: tutorDetailsMap[tutor.id]?.description || null,
        photo: tutorDetailsMap[tutor.id]?.photo || null,
        classCount: tutor._count.class
    }));
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
 * Retrieves the newest students ordered by their creation date.
 *
 * @async
 * @function getNewStudents
 * @returns {Promise<Array>} The list of newest students ordered by creation date, including level and class count.
 */
async function getNewStudents() {
    const students = await prisma.user.findMany({
        where: {
            role: 'siswa'
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
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
            createdAt: 'desc'
        }
    });

    return students.map(student => ({
        id: student.id,
        name: student.name,
        createdAt: student.createdAt,
        level: student.students?.[0]?.level || null,
        classCount: student._count?.studentClass || 0, // Include the class count
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
};