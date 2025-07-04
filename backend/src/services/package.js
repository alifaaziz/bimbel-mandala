import { prisma } from '../utils/db.js';

/**
 * Retrieves all active bimbel packages with pagination.
 *
 * @async
 * @function getActiveBimbelPackages
 * @param {Object} [options] - Pagination options.
 * @param {number} [options.page=1] - Page number (1-based).
 * @param {number} [options.pageSize=10] - Number of items per page.
 * @returns {Promise<Object>} The paginated list of active bimbel packages and total count.
 */
async function getActiveBimbelPackages({ page = 1, pageSize = 8 } = {}) {
  const skip = (page - 1) * pageSize;
  const [packages, total] = await Promise.all([
    prisma.bimbelPackage.findMany({
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
      },
      skip,
      take: pageSize
    }),
    prisma.bimbelPackage.count({
      where: {
        isActive: true
      }
    })
  ]);

  return {
    data: packages.map(pkg => ({
      name: pkg.name,
      level: pkg.level,
      totalMeetings: pkg.totalMeetings,
      time: pkg.time,
      duration: pkg.duration,
      area: pkg.area,
      slug: pkg.slug,
      isActive: pkg.isActive,
      tutorName: pkg.user.name,
      photo: pkg.user.tutors[0]?.photo,
      groupType: pkg.groupType.map(gt => ({
        type: gt.type,
        price: gt.price,
        discPrice: gt.discPrice
      })),
      days: pkg.packageDay.map(day => day.day.daysName)
    })),
    total,
    page,
    pageSize
  };
}

/**
 * Retrieves all bimbel packages with pagination.
 *
 * @async
 * @function getAllBimbelPackages
 * @param {Object} [options] - Pagination options.
 * @param {number} [options.page=1] - Page number (1-based).
 * @param {number} [options.pageSize=10] - Number of items per page.
 * @returns {Promise<Object>} The paginated list of bimbel packages and total count.
 */
async function getAllBimbelPackages({ page = 1, pageSize = 10 } = {}) {
  const skip = (page - 1) * pageSize;
  const [packages, total] = await Promise.all([
    prisma.bimbelPackage.findMany({
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
      },
      skip,
      take: pageSize
    }),
    prisma.bimbelPackage.count({})
  ]);

  return {
    data: packages.map(pkg => ({
      name: pkg.name,
      level: pkg.level,
      totalMeetings: pkg.totalMeetings,
      time: pkg.time,
      duration: pkg.duration,
      area: pkg.area,
      slug: pkg.slug,
      isActive: pkg.isActive,
      tutorName: pkg.user.name,
      photo: pkg.user.tutors[0]?.photo,
      groupType: pkg.groupType.map(gt => ({
        type: gt.type,
        price: gt.price,
        discPrice: gt.discPrice
      })),
      days: pkg.packageDay.map(day => day.day.daysName)
    })),
    total,
    page,
    pageSize
  };
}

/**
 * Retrieves a bimbel package by slug.
 * 
 * @async
 * @function getBimbelPackageBySlug
 * @param {string} slug - The package slug.
 * @returns {Promise<Object|null>} The bimbel package or null if not found.
 */
async function getBimbelPackageBySlug(slug) {
  const pkg = await prisma.bimbelPackage.findUnique({
    where: {
      slug: slug
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
          id: true,
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
    slug: pkg.slug,
    status: pkg.isActive ? 'aktif' : 'nonaktif',
    tutorName: pkg.user.name,
    photo: pkg.user.tutors[0]?.photo,
    groupType: pkg.groupType.map(gt => ({
      id: gt.id,
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

  const tutor = await prisma.user.findUnique({ where: { id: tutorId } });
  if (!tutor) {
    throw new Error('Tutor (user) tidak ditemukan');
  }

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

  const slugBase = `${name.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase().replace(/\s+/g, '-')}`;
  let slug;
  do {
    const randomString = Math.random().toString(36).substring(2, 8);
    slug = `${slugBase}-${randomString}`;
  } while (await prisma.schedule.findUnique({ where: { slug } }));

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
      slug,
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

  const tutor = await prisma.user.findUnique({ where: { id: tutorId } });
  if (!tutor) {
    throw new Error('Tutor (user) tidak ditemukan');
  }

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
 * Updates a bimbel package by slug with new data.
 *
 * @async
 * @function updateBimbelPackage
 * @param {string} slug - The package slug.
 * @param {Object} data - The new package data.
 * @returns {Promise<Object>} The updated bimbel package.
 */
async function updateBimbelPackage(slug, data) {
  const { name, level, totalMeetings, time, duration, area, tutorId, groupType, days, discount } = data;

  const existing = await prisma.bimbelPackage.findUnique({
    where: { slug },
    include: {
      groupType: true,
      packageDay: {
        include: {
          day: true
        }
      }
    }
  });

  if (!existing) {
    throw new Error('Package not found');
  }

  const updateData = {
    name,
    level,
    totalMeetings,
    time,
    duration,
    area,
    userId: tutorId,
    discount
  };

  if (data.groupType) {
    const oldGroupTypes = await prisma.groupType.findMany({
      where: { packageId: existing.id }
    });

    const oldGroupTypeMap = {};
    for (const oldGt of oldGroupTypes) {
      oldGroupTypeMap[oldGt.type] = oldGt;
    }

    for (const gt of data.groupType) {
      const oldGt = oldGroupTypeMap[gt.type];
      if (oldGt) {
        let discPrice = null;
        if (typeof discount === 'number' && discount > 0) {
          discPrice = Math.round(gt.price * (1 - discount / 100));
        }
        await prisma.groupType.update({
          where: { id: oldGt.id },
          data: {
            price: gt.price,
            discPrice
          }
        });
      }
    }
  }

  if (data.days) {
    await prisma.packageDay.deleteMany({
      where: { packageId: existing.id }
    });

    const dayIds = await prisma.day.findMany({
      where: {
        daysName: { in: data.days }
      },
      select: { id: true }
    });

    for (const day of dayIds) {
      await prisma.packageDay.create({
        data: {
          packageId: existing.id,
          dayId: day.id
        }
      });
    }
  }

  const updatedPackage = await prisma.bimbelPackage.update({
    where: { slug },
    data: updateData,
    include: {
      groupType: true,
      packageDay: { include: { day: true } }
    }
  });

  return {
    message: 'Bimbel package updated successfully',
    data: {
      id: updatedPackage.id,
      name: updatedPackage.name,
      level: updatedPackage.level,
      totalMeetings: updatedPackage.totalMeetings,
      time: updatedPackage.time,
      duration: updatedPackage.duration,
      area: updatedPackage.area,
      slug: updatedPackage.slug,
      isActive: updatedPackage.isActive,
      discount: updatedPackage.discount,
      tutorId: updatedPackage.userId,
      groupType: updatedPackage.groupType.map(gt => ({
        type: gt.type,
        price: gt.price,
        discPrice: gt.discPrice,
        maxStudent: gt.maxStudent
      })),
      days: updatedPackage.packageDay.map(pd => pd.day.daysName)
    }
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
      }
    }
  });

  const packagesWithOrderCount = packages.map(pkg => {
    const orderCountEntry = orderCounts.find(order => order.packageId === pkg.id);
    const orderCount = orderCountEntry ? orderCountEntry._count.packageId : 0;

    return {
      id: pkg.id,
      name: pkg.name,
      level: pkg.level,
      totalMeetings: pkg.totalMeetings,
      time: pkg.time,
      duration: pkg.duration,
      area: pkg.area,
      slug: pkg.slug,
      isActive: pkg.isActive,
      tutorName: pkg.user.name,
      photo: pkg.user.tutors[0]?.photo,
      groupType: pkg.groupType.map(gt => ({
        type: gt.type,
        price: gt.price,
        discPrice: gt.discPrice
      })),
      days: pkg.packageDay.map(day => day.day.daysName),
      orderCount
    };
  });

  return packagesWithOrderCount
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 4);
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
      userId: user.id,
      isActive: true
    },
    include: {
      user: {
        select: {
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
    slug: pkg.slug,
    isActive: pkg.isActive,
    photo: pkg.user.tutors[0]?.photo || null,
    groupType: pkg.groupType.map(gt => ({
      type: gt.type,
      price: gt.price * 0.9,
      discPrice: gt.discPrice !== null ? gt.discPrice * 0.9 : null
    })),
    days: pkg.packageDay.map(day => day.day.daysName)
  }));
}


/**
 * Retrieves a bimbel package by slug associated with the logged-in user.
 *
 * @async
 * @function getMyPackageBySlug
 * @param {string} slug - The package slug.
 * @param {Object} user - The logged-in user object.
 * @returns {Promise<Object|null>} The bimbel package or null if not found or not associated with the user.
 */
async function getMyPackageBySlug(slug, user) {
  if (user.role !== 'tutor') {
    throw new Error('Only tutors can access this resource');
  }
  
  const pkg = await prisma.bimbelPackage.findFirst({
    where: {
      slug: slug,
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
    slug: pkg.slug,
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

/**
 * Retrieves recommended bimbel packages for the logged-in user, sorted by orderCount (ascending) and limited to 4.
 *
 * @async
 * @function getRecommendations
 * @param {Object} user - The logged-in user object.
 * @returns {Promise<Array|null>} The list of recommended bimbel packages or null if not a student.
 */
async function getRecommendations(user) {
  if (user.role !== 'siswa') {
    return null;
  }

  const student = await prisma.student.findUnique({
    where: {
      userId: user.id
    },
    select: {
      level: true
    }
  });

  if (!student) {
    return null;
  }

  const { level } = student;

  const recommendedPackages = await prisma.bimbelPackage.findMany({
    where: {
      level: level,
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
      orders: true
    }
  });

  const packagesWithOrderCount = recommendedPackages.map(pkg => ({
    ...pkg,
    orderCount: pkg.orders.length,
    hasDiscPrice: pkg.groupType.some(gt => gt.discPrice !== null && gt.discPrice !== undefined)
  }));

  const sortedPackages = packagesWithOrderCount
    .sort((a, b) => {
      if (a.hasDiscPrice === b.hasDiscPrice) {
        return a.orderCount - b.orderCount;
      }
      return a.hasDiscPrice ? -1 : 1;
    })
    .slice(0, 4);
  
  return sortedPackages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    level: pkg.level,
    totalMeetings: pkg.totalMeetings,
    time: pkg.time,
    duration: pkg.duration,
    area: pkg.area,
    slug: pkg.slug,
    isActive: pkg.isActive,
    tutorName: pkg.user.name,
    photo: pkg.user.tutors[0]?.photo || null,
    groupType: pkg.groupType.map(gt => ({
      type: gt.type,
      price: gt.price,
      discPrice: gt.discPrice
    })),
    days: pkg.packageDay.map(day => day.day.daysName),
    orderCount: pkg.orderCount
  }));
}

/**
 * Retrieves all bimbel packages that match the filters without pagination.
 *
 * @async
 * @function getFilteredBimbelPackages
 * @param {Object} [filters] - Filter options.
 * @param {string} [filters.searchText] - Search text for package name or tutor name.
 * @param {string} [filters.level] - Filter by level (e.g., "SMA", "SMP", "SD").
 * @param {string[]} [filters.hari] - Filter by days (e.g., ["Senin", "Selasa"]).
 * @param {number} [filters.durasi] - Filter by duration (in minutes).
 * @returns {Promise<Array>} The list of bimbel packages that match the filters.
 */
async function getFilteredBimbelPackages({ searchText, level, hari, durasi } = {}) {
  const whereClause = {
    isActive: true,
    ...(searchText && {
      OR: [
        { name: { contains: searchText } },
        { user: { name: { contains: searchText } } }
      ]
    }),
    ...(level && { level }),
    ...(durasi && { duration: durasi }),
    ...(hari && {
      packageDay: {
        some: {
          day: {
            daysName: { in: hari }
          }
        }
      }
    })
  };

  // Query utama untuk mengambil semua data
  const packages = await prisma.bimbelPackage.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          name: true, // Nama tutor
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
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return packages.map(pkg => ({
    name: pkg.name,
    level: pkg.level,
    totalMeetings: pkg.totalMeetings,
    time: pkg.time,
    duration: pkg.duration,
    area: pkg.area,
    slug: pkg.slug,
    isActive: pkg.isActive,
    tutorName: pkg.user.name,
    photo: pkg.user.tutors[0]?.photo,
    groupType: pkg.groupType.map(gt => ({
      type: gt.type,
      price: gt.price,
      discPrice: gt.discPrice
    })),
    days: pkg.packageDay.map(day => day.day.daysName)
  }));
}

export const BimbelPackageService = {
  getActiveBimbelPackages,
  getAllBimbelPackages,
  getBimbelPackageBySlug,
  createBimbelPackage,
  createClassBimbelPackage,
  updateBimbelPackage,
  // updateClassBimbelPackage,
  deleteBimbelPackage,
  updateBimbelPackageStatus,
  getBimbelPackagesByPopularity,
  getRunningPrograms,
  getMyPackages,
  getMyPackageBySlug,
  getBimbelPackageStatistics,
  getMyProgramsStatistics,
  getRecommendations,
  getFilteredBimbelPackages
};