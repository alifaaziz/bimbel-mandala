import { prisma } from '../utils/db.js';

/**
 * Retrieves all bimbel packages with tutor names, group type prices, and package days.
 *
 * @async
 * @function getAllBimbelPackages
 * @returns {Promise<Array>} The list of bimbel packages.
 */
async function getAllBimbelPackages() {
    const packages = await prisma.bimbelPackage.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    tutors: {
                        select: {
                            photo: true
                        }
                    }
                }
            },
            groupType: {
                select: {
                    type: true,
                    price: true
                }
            },
            packageDay: {
                select: {
                    day: {
                        select: {
                            daysName: true
                        }
                    }
                }
            },
        },
        orderBy: {
            basePrice: 'asc'
        }
    });

    return packages.map(pkg => {
        const groupTypePrices = pkg.groupType.map(gt => ({
            type: gt.type,
            price: parseInt(pkg.basePrice) + parseInt(gt.price)
        }));

        return {
            id: pkg.id,
            name: pkg.name,
            level: pkg.level,
            totalMeetings: pkg.totalMeetings,
            time: pkg.time,
            duration: pkg.duration,
            area: pkg.area,
            tutorName: pkg.user.name,
            photo: pkg.user.tutors[0]?.photo,
            groupTypePrices,
            days: pkg.packageDay.map(day => day.day)
        };
    });
}

/**
 * Retrieves a bimbel package by ID with tutor name, group type prices, and package days.
 * 
 * @async
 * @function getBimbelPackageById
 * @param {string} id - The package ID.
 * @returns {Promise<Object>} The bimbel package.
 */
async function getBimbelPackageById(id) {
    const pkg = await prisma.bimbelPackage.findUnique({
        where: {
            id: id
        },
        include: {
            user: {
                select: {
                    name: true,
                    tutors: {
                        select: {
                            photo: true
                        }
                    }
                }
            },
            groupType: {
                select: {
                    type: true,
                    price: true
                }
            },
            packageDay: {
                select: {
                    day: {
                        select: {
                            daysName: true
                        }
                    }
                }
            },
        },
    });

    if (!pkg) {
        return null;
    }

    const groupTypePrices = pkg.groupType.map(gt => ({
        type: gt.type,
        price: parseInt(pkg.basePrice) + parseInt(gt.price)
    }));

    return {
        id: pkg.id,
        name: pkg.name,
        level: pkg.level,
        totalMeetings: pkg.totalMeetings,
        time: pkg.time,
        duration: pkg.duration,
        area: pkg.area,
        tutorName: pkg.user.name,
        photo: pkg.user.tutors[0]?.photo,
        groupTypePrices,
        days: pkg.packageDay.map(day => day.day)
    };
}

/**
 * Creates a new bimbel package with calculated group type prices and package days.
 *
 * @async
 * @function createBimbelPackage
 * @param {Object} data - The package data.
 * @returns {Promise<Object>} The created bimbel package.
 */
async function createBimbelPackage(data) {
    const { name, level, totalMeetings, time, duration, area, basePrice, tutorId, groupType, days } = data;
  
    const privatPrice = groupType.find(gt => gt.type === 'privat').price;
  
    const calculatedGroupType = groupType.map(gt => {
      if (gt.type === 'grup3') {
        return {
          ...gt,
          price: Math.round(privatPrice * 0.6 * 3)
        };
      } else if (gt.type === 'grup5') {
        return {
          ...gt,
          price: Math.round(privatPrice * 0.6 * 5 * 0.8)
        };
      } else {
        return gt;
      }
    });

    const dayIds = await prisma.day.findMany({
      where: {
        daysName: {
          in: days
        }
      },
      select: {
        id: true
      }
    });
  
    await prisma.bimbelPackage.create({
      data: {
        name,
        level,
        totalMeetings,
        time,
        duration,
        area,
        basePrice,
        userId: tutorId,
        groupType: {
          create: calculatedGroupType
        },
        packageDay: {
          create: dayIds.map(day => ({
            day: {
              connect: {
                id: day.id
              }
            }
          }))
        }
      },
      include: {
        packageDay: true
      }
    });
  
    return {
        message: 'Bimbel package created successfully'
    };
  }

export const BimbelPackageService = {
    getAllBimbelPackages,
    getBimbelPackageById,
    createBimbelPackage
};