import { get } from 'http';
import { prisma } from '../utils/db.js';

/**
 * Retrieves all bimbel packages.
 *
 * @async
 * @function getAllBimbelPackages
 * @returns {Promise<Array>} The list of bimbel packages.
 */
async function getActiveBimbelPackages() {
  const packages = await prisma.bimbelPackage.findMany({
    where: {
      isActive: true
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
          price: true,
          discPrice: true
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
      createdAt: 'desc'
    }
  });

  return packages.map(pkg => {
    return {
      name: pkg.name,
      level: pkg.level,
      totalMeetings: pkg.totalMeetings,
      time: pkg.time,
      duration: pkg.duration,
      area: pkg.area,
      isActive: pkg.isActive,
      tutorName: pkg.user.name,
      photo: pkg.user.tutors[0]?.photo,
      groupType: pkg.groupType.map(gt => ({
        type: gt.type,
        price: gt.price,
        discPrice: gt.discPrice
      })),
      days: pkg.packageDay.map(day => day.day.daysName)
    };
  });
}

/**
 * Retrieves all bimbel packages regardless of their isActive status.
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
          price: true,
          discPrice: true
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
      createdAt: 'desc'
    }
  });

  return packages.map(pkg => {
    return {
      name: pkg.name,
      level: pkg.level,
      totalMeetings: pkg.totalMeetings,
      time: pkg.time,
      duration: pkg.duration,
      area: pkg.area,
      isActive: pkg.isActive,
      tutorName: pkg.user.name,
      photo: pkg.user.tutors[0]?.photo,
      groupType: pkg.groupType.map(gt => ({
        type: gt.type,
        price: gt.price,
        discPrice: gt.discPrice
      })),
      days: pkg.packageDay.map(day => day.day.daysName)
    };
  });
}

/**
 * Retrieves a bimbel package by ID.
 * 
 * @async
 * @function getBimbelPackageById
 * @param {string} id - The package ID.
 * @returns {Promise<Object|null>} The bimbel package or null if not found.
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
          price: true,
          discPrice: true
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
    groupType: pkg.groupType.map(gt => ({
      type: gt.type,
      price: gt.price,
      discPrice: gt.discPrice 
    })),
    days: pkg.packageDay.map(day => day.day.daysName)
  };
}

/**
 * Creates a new bimbel package.
 *
 * @async
 * @function createBimbelPackage
 * @param {Object} data - The package data.
 * @returns {Promise<Object>} The created bimbel package.
 */
async function createBimbelPackage(data) {
  const { name, level, totalMeetings, time, duration, area, tutorId, groupType, days, discount } = data;

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

  if (dayIds.length === 0) {
    throw new Error('Invalid days provided');
  }

  const calculatedGroupType = groupType.map(gt => ({
    ...gt,
    discPrice: Math.round(gt.price * (1 - discount / 100)),
    maxStudent: gt.type === 'privat' ? 1 :
                gt.type === 'grup2' ? 2 :
                gt.type === 'grup3' ? 3 :
                gt.type === 'grup4' ? 4 :
                gt.type === 'grup5' ? 5 :
                gt.maxStudent
  }));

  const createdPackage = await prisma.bimbelPackage.create({
    data: {
      name,
      level,
      totalMeetings,
      time,
      duration,
      area,
      userId: tutorId,
      discount,
      groupType: {
        create: calculatedGroupType.map(gt => ({
          type: gt.type,
          price: gt.price,
          discPrice: gt.discPrice,
          maxStudent: gt.maxStudent
        }))
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
      groupType: true,
      packageDay: true
    }
  });

  return {
    message: 'Bimbel package created successfully',
    data: createdPackage
  };
}

/**
 * Creates a new class bimbel package.
 *
 * @async
 * @function createClassBimbelPackage
 * @param {Object} data - The package data.
 * @returns {Promise<Object>} The created bimbel package.
 */
async function createClassBimbelPackage(data) {
  const { name, level, totalMeetings, time, duration, area, tutorId, groupType, days } = data;

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

  if (dayIds.length === 0) {
    throw new Error('Invalid days provided');
  }

  const createdPackage = await prisma.bimbelPackage.create({
    data: {
      name,
      level,
      totalMeetings,
      time,
      duration,
      area,
      userId: tutorId,
      groupType: {
        create: {
          type: 'kelas',
          price: groupType.price,
          maxStudent: groupType.maxStudent 
        }
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
      groupType: true,
      packageDay: {
        include: {
          day: true
        }
      }
    }
  });

  return {
    message: 'Class bimbel package created successfully',
    data: createdPackage
  };
}

/**
 * Updates a bimbel package by ID with new data.
 *
 * @async
 * @function updateBimbelPackage
 * @param {string} id - The package ID.
 * @param {Object} data - The new package data.
 * @returns {Promise<Object>} The updated bimbel package.
 */
async function updateBimbelPackage(id, data) {
  const { name, level, totalMeetings, time, duration, area, tutorId, groupType, days, discount } = data;

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

  if (dayIds.length === 0) {
    throw new Error('Invalid days provided');
  }

  const calculatedGroupType = groupType.map(gt => ({
    ...gt,
    discPrice: Math.round(gt.price * (1 - discount / 100)),
    maxStudent: gt.type === 'privat' ? 1 :
                gt.type === 'grup2' ? 2 :
                gt.type === 'grup3' ? 3 :
                gt.type === 'grup4' ? 4 :
                gt.type === 'grup5' ? 5 :
                gt.maxStudent
  }));

  const updatedPackage = await prisma.bimbelPackage.update({
    where: {
      id: id
    },
    data: {
      name,
      level,
      totalMeetings,
      time,
      duration,
      area,
      userId: tutorId,
      discount,
      groupType: {
        deleteMany: {},
        create: calculatedGroupType.map(gt => ({
          type: gt.type,
          price: gt.price,
          discPrice: gt.discPrice,
          maxStudent: gt.maxStudent
        }))
      },
      packageDay: {
        deleteMany: {},
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
      groupType: true,
      packageDay: {
        include: {
          day: true
        }
      }
    }
  });

  return {
    message: 'Bimbel package updated successfully',
    data: updatedPackage
  };
}

/**
 * Updates a class bimbel package by ID with new data.
 *
 * @async
 * @function updateClassBimbelPackage
 * @param {string} id - The package ID.
 * @param {Object} data - The new package data.
 * @returns {Promise<Object>} The updated class bimbel package.
 */
async function updateClassBimbelPackage(id, data) {
  const { name, level, totalMeetings, time, duration, area, tutorId, groupType, days, discount } = data;

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

  if (dayIds.length === 0) {
    throw new Error('Invalid days provided');
  }

  const updatedGroupType = [
    {
      type: 'kelas',
      price: groupType.price,
      discPrice: Math.round(groupType.price * (1 - discount / 100)),
      maxStudent: groupType.maxStudent
    }
  ];

  const updatedPackage = await prisma.bimbelPackage.update({
    where: {
      id: id
    },
    data: {
      name,
      level,
      totalMeetings,
      time,
      duration,
      area,
      userId: tutorId,
      discount,
      groupType: {
        deleteMany: {},
        create: updatedGroupType
      },
      packageDay: {
        deleteMany: {},
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
      groupType: true,
      packageDay: {
        include: {
          day: true
        }
      }
    }
  });

  return {
    message: 'Class bimbel package updated successfully',
    data: updatedPackage
  };
}

/**
 * Deletes a bimbel package by ID.
 *
 * @async
 * @function deleteBimbelPackage
 * @param {string} id - The package ID.
 * @returns {Promise<Object>} The deletion result.
 */
async function deleteBimbelPackage(id) {
  await prisma.groupType.deleteMany({
    where: {
      packageId: id
    }
  });

  await prisma.packageDay.deleteMany({
    where: {
      packageId: id
    }
  });

  await prisma.bimbelPackage.delete({
    where: {
      id: id
    }
  });

  return {
    message: 'Bimbel package deleted successfully'
  };
}

/**
 * Updates the isActive status of bimbelPackage to true
 * if all schedules in a class have attendances.
 *
 * @async
 * @function updateBimbelPackageStatus
 * @returns {Promise<void>}
 */
async function updateBimbelPackageStatus() {
  const classes = await prisma.class.findMany({
    include: {
      schedules: {
        include: {
          attendances: true
        }
      },
      order: {
        include: {
          bimbelPackage: true
        }
      }
    }
  });

  for (const classItem of classes) {
    const allSchedulesHaveAttendance = classItem.schedules.every(
      (schedule) => schedule.attendances.length > 0
    );

    if (allSchedulesHaveAttendance && classItem.order?.bimbelPackage) {
      await prisma.bimbelPackage.update({
        where: {
          id: classItem.order.bimbelPackage.id
        },
        data: {
          isActive: true
        }
      });
    }
  }
  return { message: 'Bimbel package status updated successfully' };
}

/**
 * Retrieves bimbel packages sorted by the number of orders (popularity).
 *
 * @async
 * @function getBimbelPackagesByPopularity
 * @returns {Promise<Array>} The list of bimbel packages sorted by popularity.
 */
async function getBimbelPackagesByPopularity() {
  const orderCounts = await prisma.order.groupBy({
    by: ['packageId'],
    _count: {
      packageId: true
    },
    orderBy: {
      _count: {
        packageId: 'desc'
      }
    }
  });

  const packageIds = orderCounts.map(order => order.packageId);

  const packages = await prisma.bimbelPackage.findMany({
    where: {
      id: {
        in: packageIds
      }
    },
    include: {
      groupType: {
        select: {
          type: true,
          price: true,
          discPrice: true
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
      }
    }
  });

  const sortedPackages = packageIds.map(packageId =>
    packages.find(pkg => pkg.id === packageId)
  );

  return sortedPackages.map(pkg => {
    const orderCount = orderCounts.find(order => order.packageId === pkg.id)._count.packageId;
    return {
      id: pkg.id,
      name: pkg.name,
      level: pkg.level,
      totalMeetings: pkg.totalMeetings,
      time: pkg.time,
      duration: pkg.duration,
      area: pkg.area,
      isActive: pkg.isActive,
      groupType: pkg.groupType.map(gt => ({
        type: gt.type,
        price: gt.price,
        discPrice: gt.discPrice
      })),
      days: pkg.packageDay.map(day => day.day.daysName),
      orderCount
    };
  });
}

/**
 * Retrieves classes that are still running.
 *
 * @async
 * @function getRunningPrograms
 * @returns {Promise<Array>} The list of running programs with classId, tutorName, and bimbelPackageName.
 */
async function getRunningPrograms() {
  const classes = await prisma.class.findMany({
    where: {
      status: 'berjalan'
    },
    include: {
      tutor: {
        select: {
          name: true,
          tutors: {
            select: {
              gender: true
            }
          }
        }
      },
      order: {
        include: {
          bimbelPackage: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  return classes.map(cls => ({
    classId: cls.id,
    tutorName: cls.tutor
      ? `${cls.tutor.tutors[0]?.gender === 'Male' ? 'Pak' : 'Bu'} ${cls.tutor.name}`
      : null,
    bimbelPackageName: cls.order?.bimbelPackage?.name || null
  }));
}

/**
 * Retrieves bimbel packages associated with the logged-in tutor.
 *
 * @async
 * @function getMyPackages
 * @param {Object} user - The logged-in user object.
 * @returns {Promise<Array>} The list of bimbel packages for the tutor.
 */
async function getMyPackages(user) {
  if (user.role !== 'tutor') {
    throw new Error('Only tutors can access this resource');
  }

  const packages = await prisma.bimbelPackage.findMany({
    where: {
      userId: user.id
    },
    include: {
      groupType: {
        select: {
          type: true,
          price: true,
          discPrice: true
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
      }
    }
  });

  return packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    level: pkg.level,
    totalMeetings: pkg.totalMeetings,
    time: pkg.time,
    duration: pkg.duration,
    area: pkg.area,
    isActive: pkg.isActive,
    groupType: pkg.groupType.map(gt => ({
      type: gt.type,
      price: gt.price * 0.9,
      discPrice: gt.discPrice !== null ? gt.discPrice * 0.9 : null
    })),
    days: pkg.packageDay.map(day => day.day.daysName)
  }));
}

/**
 * Retrieves a bimbel package by ID associated with the logged-in user.
 *
 * @async
 * @function getMyPackageById
 * @param {string} id - The package ID.
 * @param {Object} user - The logged-in user object.
 * @returns {Promise<Object|null>} The bimbel package or null if not found or not associated with the user.
 */
async function getMyPackageById(id, user) {
  if (user.role !== 'tutor') {
    throw new Error('Only tutors can access this resource');
  }
  
  const pkg = await prisma.bimbelPackage.findFirst({
    where: {
      id: id,
      userId: user.id 
    },
    include: {
      groupType: {
        select: {
          type: true,
          price: true,
          discPrice: true
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
      }
    }
  });

  if (!pkg) {
    return null;
  }

  return {
    id: pkg.id,
    name: pkg.name,
    level: pkg.level,
    totalMeetings: pkg.totalMeetings,
    time: pkg.time,
    duration: pkg.duration,
    area: pkg.area,
    isActive: pkg.isActive,
    groupType: pkg.groupType.map(gt => ({
      type: gt.type,
      price: gt.price * 0.9,
      discPrice: gt.discPrice !== null ? gt.discPrice * 0.9 : null
    })),
    days: pkg.packageDay.map(day => day.day.daysName)
  };
}

/**
 * Retrieves statistics for bimbel packages.
 *
 * @async
 * @function getBimbelPackageStatistics
 * @returns {Promise<Object>} The statistics for bimbel packages.
 */
async function getBimbelPackageStatistics() {
  const totalPackages = await prisma.bimbelPackage.count();
  const activePackages = await prisma.bimbelPackage.count({
    where: {
      isActive: true
    }
  });
  const inactivePackages = totalPackages - activePackages;

  return {
    totalPackages,
    activePackages,
    inactivePackages
  };
}

/**
 * Retrieves programs statistics for the logged-in user.
 * 
 * @async
 * @function getMyProgramsStatistics
 * @param {Object} user - The logged-in user object.
 * @returns {Promise<Object>} The statistics for the user's programs.
 */
async function getMyProgramsStatistics(user) {
  if (user.role === 'siswa') {
    const studentClasses = await prisma.studentClass.findMany({
      where: {
        userId: user.id
      },
      include: {
        class: true
      }
    });

    const runningClasses = studentClasses.filter(sc => sc.class.status === 'berjalan').length;
    const completedClasses = studentClasses.filter(sc => sc.class.status === 'selesai').length;

    return {
      runningClasses,
      completedClasses
    };
  } else if (user.role === 'tutor') {
    const classes = await prisma.class.findMany({
      where: {
        tutorId: user.id,
        status: {
          in: ['berjalan', 'selesai']
        }
      }
    });

    const activePackagesCount = await prisma.bimbelPackage.count({
      where: {
        userId: user.id,
        isActive: true
      }
    });

    const runningClasses = classes.filter(cls => cls.status === 'berjalan').length;
    const completedClasses = classes.filter(cls => cls.status === 'selesai').length;

    return {
      runningClasses,
      completedClasses,
      activePackages: activePackagesCount
    };
  } else {
    throw new Error('Role not supported for this operation');
  }
}


export const BimbelPackageService = {
  getActiveBimbelPackages,
  getAllBimbelPackages,
  getBimbelPackageById,
  createBimbelPackage,
  createClassBimbelPackage,
  updateBimbelPackage,
  updateClassBimbelPackage,
  deleteBimbelPackage,
  updateBimbelPackageStatus,
  getBimbelPackagesByPopularity,
  getRunningPrograms,
  getMyPackages,
  getMyPackageById,
  getBimbelPackageStatistics,
  getMyProgramsStatistics
};