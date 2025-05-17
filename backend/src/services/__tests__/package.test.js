import { jest } from '@jest/globals';

const mockPrisma = {
  bimbelPackage: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn()
  },
  groupType: { deleteMany: jest.fn() },
  packageDay: { deleteMany: jest.fn() },
  day: { findMany: jest.fn() },
  order: { groupBy: jest.fn() },
  class: { findMany: jest.fn() },
  studentClass: { findMany: jest.fn() } // ← tambahkan ini!
};

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma
}));

const { BimbelPackageService } = await import('../package.js');

beforeEach(() => {
  jest.clearAllMocks();
  mockPrisma.user = { findUnique: jest.fn().mockResolvedValue({ id: 1 }) }; // default: tutor ditemukan
});

describe('BimbelPackageService', () => {
  it('getActiveBimbelPackages returns mapped data', async () => {
    mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
      {
        name: 'Paket A',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 90,
        area: 'Jakarta',
        isActive: true,
        user: { name: 'Tutor', tutors: [{ photo: 'photo.jpg' }] },
        groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: [{ day: { daysName: 'Senin' } }]
      }
    ]);
    const result = await BimbelPackageService.getActiveBimbelPackages();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toMatchObject({
      name: 'Paket A',
      level: 'SMA',
      totalMeetings: 10,
      time: '10:00',
      duration: 90,
      area: 'Jakarta',
      isActive: true,
      tutorName: 'Tutor',
      photo: 'photo.jpg',
      groupType: [expect.objectContaining({ type: 'privat', price: 100000, discPrice: 90000 })],
      days: ['Senin']
    });
    // Pastikan tidak ada properti null (kecuali memang null di mock)
    Object.values(result[0]).forEach(val => {
      if (Array.isArray(val)) return;
      expect(val).not.toBeNull();
    });
  });

  it('getAllBimbelPackages returns paginated data', async () => {
    mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
      {
        name: 'Paket B',
        level: 'SMP',
        totalMeetings: 8,
        time: '09:00',
        duration: 60,
        area: 'Bandung',
        isActive: true,
        user: { name: 'Tutor2', tutors: [{ photo: 'photo2.jpg' }] },
        groupType: [{ type: 'grup2', price: 80000, discPrice: 70000 }],
        packageDay: [{ day: { daysName: 'Selasa' } }]
      }
    ]);
    mockPrisma.bimbelPackage.count.mockResolvedValueOnce(1);
    const result = await BimbelPackageService.getAllBimbelPackages({ page: 1, pageSize: 1 });
    expect(result.data[0]).toMatchObject({
      name: 'Paket B',
      tutorName: 'Tutor2',
      photo: 'photo2.jpg',
      groupType: [expect.objectContaining({ type: 'grup2' })],
      days: ['Selasa']
    });
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(1);
  });

  it('getAllBimbelPackages uses default page and pageSize if not provided', async () => {
    mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
      {
        name: 'Paket Default',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 90,
        area: 'Jakarta',
        isActive: true,
        user: { name: 'Tutor Default', tutors: [{ photo: 'photo.jpg' }] },
        groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: [{ day: { daysName: 'Senin' } }]
      }
    ]);
    mockPrisma.bimbelPackage.count.mockResolvedValueOnce(1);
    const result = await BimbelPackageService.getAllBimbelPackages();
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.data[0]).toMatchObject({
      name: 'Paket Default',
      tutorName: 'Tutor Default',
      photo: 'photo.jpg',
      groupType: [expect.objectContaining({ type: 'privat' })],
      days: ['Senin']
    });
  });

  it('getBimbelPackageById returns mapped data', async () => {
    mockPrisma.bimbelPackage.findUnique.mockResolvedValueOnce({
      id: 'pkg1',
      name: 'Paket C',
      level: 'SMA',
      totalMeetings: 12,
      time: '13:00',
      duration: 120,
      area: 'Depok',
      user: { name: 'Tutor3', tutors: [{ photo: 'photo3.jpg' }] },
      groupType: [{ type: 'grup3', price: 120000, discPrice: 100000 }],
      packageDay: [{ day: { daysName: 'Rabu' } }]
    });
    const result = await BimbelPackageService.getBimbelPackageById('pkg1');
    expect(result).toMatchObject({
      id: 'pkg1',
      name: 'Paket C',
      level: 'SMA',
      totalMeetings: 12,
      time: '13:00',
      duration: 120,
      area: 'Depok',
      tutorName: 'Tutor3',
      photo: 'photo3.jpg',
      groupType: [expect.objectContaining({ type: 'grup3', price: 120000, discPrice: 100000 })],
      days: ['Rabu']
    });
    Object.values(result).forEach(val => {
      if (Array.isArray(val)) return;
      expect(val).not.toBeNull();
    });
  });

  it('getBimbelPackageById returns null if not found', async () => {
    mockPrisma.bimbelPackage.findUnique.mockResolvedValueOnce(null);
    const result = await BimbelPackageService.getBimbelPackageById('notfound');
    expect(result).toBeNull();
  });

  it('createBimbelPackage throws if days invalid', async () => {
    mockPrisma.user = { findUnique: jest.fn().mockResolvedValue({ id: 1 }) }; // pastikan tutor ditemukan
    mockPrisma.day.findMany.mockResolvedValueOnce([]);
    await expect(BimbelPackageService.createBimbelPackage({
      name: 'Paket D', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
      tutorId: 1, groupType: [{ type: 'privat', price: 100000 }], days: ['Sabtu'], discount: 10
    })).rejects.toThrow('Invalid days provided');
  });

  it('createBimbelPackage throws if tutor not found', async () => {
    mockPrisma.user = { findUnique: jest.fn().mockResolvedValueOnce(null) };
    await expect(BimbelPackageService.createBimbelPackage({
      name: 'Paket X', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
      tutorId: 999, groupType: [{ type: 'privat', price: 100000 }], days: ['Senin'], discount: 10
    })).rejects.toThrow('Tutor (user) tidak ditemukan');
  });

  it('createBimbelPackage returns created data', async () => {
    mockPrisma.user = { findUnique: jest.fn().mockResolvedValue({ id: 1 }) };
    mockPrisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
    mockPrisma.bimbelPackage.create.mockResolvedValueOnce({ id: 'pkg2', groupType: [], packageDay: [] });
    const result = await BimbelPackageService.createBimbelPackage({
      name: 'Paket E', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
      tutorId: 1, groupType: [{ type: 'privat', price: 100000 }], days: ['Sabtu', 'Minggu'], discount: 10
    });
    expect(result).toHaveProperty('message');
    expect(result.data).toHaveProperty('id', 'pkg2');
    expect(result.data).not.toBeNull();
    Object.values(result.data).forEach(val => {
      if (Array.isArray(val)) return;
      expect(val).not.toBeNull();
    });
  });

  it('createBimbelPackage returns correct structure and types', async () => {
    const fakeReturn = {
      id: '0196dc4c-52bb-7f60-9853-b0b12c6da401',
      name: 'Matematika Mudah',
      level: 'SMA',
      totalMeetings: 4,
      time: '2025-03-24T19:00:00.000Z',
      duration: 120,
      area: 'Semarang',
      userId: '0195c5ed-3fc9-771d-bced-9c4b10afd9a2',
      discount: "10",
      isActive: true,
      groupType: [
        { id: 'gt1', type: 'privat', price: "580000", discPrice: "522000", packageId: '0196dc4c-52bb-7f60-9853-b0b12c6da401', maxStudent: "1" }
      ],
      packageDay: [
        { id: 'pd1', packageId: '0196dc4c-52bb-7f60-9853-b0b12c6da401', dayId: 'd1' }
      ]
    };
    mockPrisma.user = { findUnique: jest.fn().mockResolvedValue({ id: 1 }) };
    mockPrisma.day.findMany.mockResolvedValueOnce([{ id: 'd1' }]);
    mockPrisma.bimbelPackage.create.mockResolvedValueOnce(fakeReturn);

    const result = await BimbelPackageService.createBimbelPackage({
      name: 'Matematika Mudah',
      level: 'SMA',
      totalMeetings: 4,
      time: '2025-03-24T19:00:00.000Z',
      duration: 120,
      area: 'Semarang',
      tutorId: 1,
      groupType: [{ type: 'privat', price: 580000 }],
      days: ['Senin'],
      discount: 10
    });

    expect(result).toHaveProperty('message', 'Bimbel package created successfully');
    expect(result.data).toMatchObject({
      id: expect.any(String),
      name: 'Matematika Mudah',
      groupType: expect.any(Array),
      packageDay: expect.any(Array)
    });
    expect(result.data.groupType[0]).toHaveProperty('type', 'privat');
    expect(result.data.groupType[0]).toHaveProperty('maxStudent', expect.any(String));
  });

  it('updateBimbelPackage throws if days invalid', async () => {
    mockPrisma.day.findMany.mockResolvedValueOnce([]);
    await expect(BimbelPackageService.updateBimbelPackage('pkg3', {
      name: 'Paket F', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
      tutorId: 1, groupType: [{ type: 'privat', price: 100000 }], days: ['Sabtu'], discount: 10
    })).rejects.toThrow('Invalid days provided');
  });

  it('updateBimbelPackage returns updated data', async () => {
    mockPrisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
    mockPrisma.bimbelPackage.update.mockResolvedValueOnce({ id: 'pkg4', groupType: [], packageDay: { day: {} } });
    const result = await BimbelPackageService.updateBimbelPackage('pkg4', {
      name: 'Paket G', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
      tutorId: 1, groupType: [{ type: 'privat', price: 100000 }], days: ['Sabtu'], discount: 10
    });
    expect(result).toHaveProperty('message');
    expect(result.data).toHaveProperty('id', 'pkg4');
  });

  it('deleteBimbelPackage deletes related data', async () => {
    mockPrisma.groupType.deleteMany.mockResolvedValueOnce();
    mockPrisma.packageDay.deleteMany.mockResolvedValueOnce();
    mockPrisma.bimbelPackage.delete.mockResolvedValueOnce();
    const result = await BimbelPackageService.deleteBimbelPackage('pkg5');
    expect(result).toHaveProperty('message');
    expect(mockPrisma.groupType.deleteMany).toHaveBeenCalled();
    expect(mockPrisma.packageDay.deleteMany).toHaveBeenCalled();
    expect(mockPrisma.bimbelPackage.delete).toHaveBeenCalled();
  });

  it('getBimbelPackageStatistics returns correct stats', async () => {
    mockPrisma.bimbelPackage.count
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(4); // active
    const result = await BimbelPackageService.getBimbelPackageStatistics();
    expect(result).toEqual({
      totalPackages: 10,
      activePackages: 4,
      inactivePackages: 6
    });
  });

  it('createClassBimbelPackage throws if days invalid', async () => {
    mockPrisma.user = { findUnique: jest.fn().mockResolvedValue({ id: 1 }) }; // pastikan tutor ditemukan
    mockPrisma.day.findMany.mockResolvedValueOnce([]);
    await expect(BimbelPackageService.createClassBimbelPackage({
      name: 'Kelas', level: 'SMA', totalMeetings: 5, time: '10:00', duration: 60, area: 'Jakarta',
      tutorId: 1, groupType: { price: 100000, maxStudent: 10 }, days: ['Sabtu']
    })).rejects.toThrow('Invalid days provided');
  });

  it('createClassBimbelPackage throws if tutor not found', async () => {
    mockPrisma.user = { findUnique: jest.fn().mockResolvedValueOnce(null) };
    await expect(BimbelPackageService.createClassBimbelPackage({
      name: 'Kelas', level: 'SMA', totalMeetings: 5, time: '10:00', duration: 60, area: 'Jakarta',
      tutorId: 999, groupType: { price: 100000, maxStudent: 10 }, days: ['Senin']
    })).rejects.toThrow('Tutor (user) tidak ditemukan');
  });

  it('createClassBimbelPackage returns created data', async () => {
    mockPrisma.user = { findUnique: jest.fn().mockResolvedValue({ id: 1 }) }; // pastikan tutor ditemukan
    mockPrisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
    mockPrisma.bimbelPackage.create.mockResolvedValueOnce({ id: 'cls1', groupType: [], packageDay: [] });
    const result = await BimbelPackageService.createClassBimbelPackage({
      name: 'Kelas', level: 'SMA', totalMeetings: 5, time: '10:00', duration: 60, area: 'Jakarta',
      tutorId: 1, groupType: { price: 100000, maxStudent: 10 }, days: ['Sabtu']
    });
    expect(result).toHaveProperty('message');
    expect(result.data).toHaveProperty('id', 'cls1');
  });

  it('updateClassBimbelPackage throws if days invalid', async () => {
    mockPrisma.day.findMany.mockResolvedValueOnce([]);
    await expect(BimbelPackageService.updateClassBimbelPackage('cls2', {
      name: 'Kelas', level: 'SMA', totalMeetings: 5, time: '10:00', duration: 60, area: 'Jakarta',
      tutorId: 1, groupType: { price: 100000, maxStudent: 10 }, days: ['Sabtu'], discount: 10
    })).rejects.toThrow('Invalid days provided');
  });

  it('updateClassBimbelPackage returns updated data', async () => {
    mockPrisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
    mockPrisma.bimbelPackage.update.mockResolvedValueOnce({ id: 'cls3', groupType: [], packageDay: { day: {} } });
    const result = await BimbelPackageService.updateClassBimbelPackage('cls3', {
      name: 'Kelas', level: 'SMA', totalMeetings: 5, time: '10:00', duration: 60, area: 'Jakarta',
      tutorId: 1, groupType: { price: 100000, maxStudent: 10 }, days: ['Sabtu'], discount: 10
    });
    expect(result).toHaveProperty('message');
    expect(result.data).toHaveProperty('id', 'cls3');
  });

  it('updateBimbelPackageStatus updates isActive if all schedules have attendance', async () => {
    mockPrisma.class.findMany.mockResolvedValueOnce([
      {
        schedules: [
          { attendances: [{}, {}] },
          { attendances: [{}] }
        ],
        order: { bimbelPackage: { id: 'pkg1' } }
      }
    ]);
    mockPrisma.bimbelPackage.update.mockResolvedValueOnce({});
    const result = await BimbelPackageService.updateBimbelPackageStatus();
    expect(result).toHaveProperty('message');
    expect(mockPrisma.bimbelPackage.update).toHaveBeenCalledWith({
      where: { id: 'pkg1' },
      data: { isActive: true }
    });
  });

  it('updateBimbelPackageStatus does nothing if not all schedules have attendance', async () => {
    mockPrisma.class.findMany.mockResolvedValueOnce([
      {
        schedules: [
          { attendances: [] },
          { attendances: [{}] }
        ],
        order: { bimbelPackage: { id: 'pkg2' } }
      }
    ]);
    const result = await BimbelPackageService.updateBimbelPackageStatus();
    expect(result).toHaveProperty('message');
    expect(mockPrisma.bimbelPackage.update).not.toHaveBeenCalled();
  });

  it('getBimbelPackagesByPopularity returns sorted packages', async () => {
    mockPrisma.order.groupBy.mockResolvedValueOnce([
      { packageId: 'pkg1', _count: { packageId: 5 } },
      { packageId: 'pkg2', _count: { packageId: 2 } }
    ]);
    mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
      {
        id: 'pkg1',
        name: 'Populer',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 90,
        area: 'Jakarta',
        isActive: true,
        groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: [{ day: { daysName: 'Senin' } }]
      },
      {
        id: 'pkg2',
        name: 'Biasa',
        level: 'SMP',
        totalMeetings: 8,
        time: '09:00',
        duration: 60,
        area: 'Bandung',
        isActive: true,
        groupType: [{ type: 'grup2', price: 80000, discPrice: 70000 }],
        packageDay: [{ day: { daysName: 'Selasa' } }]
      }
    ]);
    const result = await BimbelPackageService.getBimbelPackagesByPopularity();
    expect(result[0]).toMatchObject({ id: 'pkg1', orderCount: 5 });
    expect(result[1]).toMatchObject({ id: 'pkg2', orderCount: 2 });
  });

  it('getRunningPrograms returns running classes', async () => {
    mockPrisma.class.findMany.mockResolvedValueOnce([
      {
        id: 1,
        tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
        order: { bimbelPackage: { name: 'Paket A' } }
      },
      {
        id: 2,
        tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] },
        order: { bimbelPackage: { name: 'Paket B' } }
      },
      {
        id: 3,
        tutor: null,
        order: { bimbelPackage: { name: 'Paket C' } }
      }
    ]);
    const result = await BimbelPackageService.getRunningPrograms();
    expect(result[0]).toMatchObject({ tutorName: 'Pak Budi', bimbelPackageName: 'Paket A' });
    expect(result[1]).toMatchObject({ tutorName: 'Bu Siti', bimbelPackageName: 'Paket B' });
    expect(result[2]).toMatchObject({ tutorName: null, bimbelPackageName: 'Paket C' });
  });

  it('getRunningPrograms returns null bimbelPackageName if order or bimbelPackage is null', async () => {
    mockPrisma.class.findMany.mockResolvedValueOnce([
      {
        id: 10,
        tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
        order: null
      },
      {
        id: 11,
        tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] },
        order: { bimbelPackage: null }
      }
    ]);
    const result = await BimbelPackageService.getRunningPrograms();
    expect(result[0]).toMatchObject({ tutorName: 'Pak Budi', bimbelPackageName: null });
    expect(result[1]).toMatchObject({ tutorName: 'Bu Siti', bimbelPackageName: null });
  });

  it('getMyPackages returns packages for tutor', async () => {
    mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
      {
        id: 'pkg1',
        name: 'Paket Tutor',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 90,
        area: 'Jakarta',
        isActive: true,
        groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: [{ day: { daysName: 'Senin' } }]
      }
    ]);
    const result = await BimbelPackageService.getMyPackages({ id: 1, role: 'tutor' });
    expect(result[0]).toMatchObject({
      id: 'pkg1',
      name: 'Paket Tutor',
      groupType: [expect.objectContaining({ price: 90000 })]
    });
  });

  it('getMyPackages throws if not tutor', async () => {
    await expect(BimbelPackageService.getMyPackages({ id: 2, role: 'siswa' }))
      .rejects.toThrow('Only tutors can access this resource');
  });

  it('getMyPackageById returns package for tutor', async () => {
    mockPrisma.bimbelPackage.findFirst.mockResolvedValueOnce({
      id: 'pkg1',
      name: 'Paket Tutor',
      level: 'SMA',
      totalMeetings: 10,
      time: '10:00',
      duration: 90,
      area: 'Jakarta',
      isActive: true,
      groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
      packageDay: [{ day: { daysName: 'Senin' } }]
    });
    const result = await BimbelPackageService.getMyPackageById('pkg1', { id: 1, role: 'tutor' });
    expect(result).toMatchObject({
      id: 'pkg1',
      name: 'Paket Tutor',
      groupType: [expect.objectContaining({ price: 90000 })]
    });
  });

  it('getMyPackageById returns null if not found', async () => {
    mockPrisma.bimbelPackage.findFirst.mockResolvedValueOnce(null);
    const result = await BimbelPackageService.getMyPackageById('notfound', { id: 1, role: 'tutor' });
    expect(result).toBeNull();
  });

  it('getMyPackageById throws if not tutor', async () => {
    await expect(BimbelPackageService.getMyPackageById('pkg1', { id: 2, role: 'siswa' }))
      .rejects.toThrow('Only tutors can access this resource');
  });

  it('getMyProgramsStatistics returns stats for siswa', async () => {
    mockPrisma.studentClass.findMany.mockResolvedValueOnce([
      { class: { status: 'berjalan' } },
      { class: { status: 'selesai' } },
      { class: { status: 'berjalan' } }
    ]);
    const result = await BimbelPackageService.getMyProgramsStatistics({ id: 1, role: 'siswa' });
    expect(result).toEqual({ runningClasses: 2, completedClasses: 1 });
  });

  it('getMyProgramsStatistics returns stats for tutor', async () => {
    mockPrisma.class.findMany.mockResolvedValueOnce([
      { status: 'berjalan' },
      { status: 'selesai' },
      { status: 'selesai' }
    ]);
    mockPrisma.bimbelPackage.count.mockResolvedValueOnce(2);
    const result = await BimbelPackageService.getMyProgramsStatistics({ id: 1, role: 'tutor' });
    expect(result).toEqual({ runningClasses: 1, completedClasses: 2, activePackages: 2 });
  });

  it('getMyProgramsStatistics throws if role not supported', async () => {
    await expect(BimbelPackageService.getMyProgramsStatistics({ id: 1, role: 'admin' }))
      .rejects.toThrow('Role not supported for this operation');
  });

    it('createBimbelPackage should return groupType with correct maxStudent as string', async () => {
        const fakeReturn = {
            id: '0196dc4c-52bb-7f60-9853-b0b12c6da401',
            name: 'Matematika Mudah',
            level: 'SMA',
            totalMeetings: 4,
            time: '2025-03-24T19:00:00.000Z',
            duration: 120,
            area: 'Semarang',
            userId: '0195c5ed-3fc9-771d-bced-9c4b10afd9a2',
            discount: "10",
            isActive: true,
            groupType: [
                { id: 'gt1', type: 'privat', price: "580000", discPrice: "522000", packageId: '0196dc4c-52bb-7f60-9853-b0b12c6da401', maxStudent: "1" },
                { id: 'gt2', type: 'grup2', price: "980000", discPrice: "882000", packageId: '0196dc4c-52bb-7f60-9853-b0b12c6da401', maxStudent: "2" },
                { id: 'gt3', type: 'grup3', price: "1380000", discPrice: "1242000", packageId: '0196dc4c-52bb-7f60-9853-b0b12c6da401', maxStudent: "3" },
                { id: 'gt4', type: 'grup4', price: "1900000", discPrice: "1710000", packageId: '0196dc4c-52bb-7f60-9853-b0b12c6da401', maxStudent: "4" },
                { id: 'gt5', type: 'grup5', price: "2340000", discPrice: "2106000", packageId: '0196dc4c-52bb-7f60-9853-b0b12c6da401', maxStudent: "5" }
            ],
            packageDay: [
                { id: 'pd1', packageId: '0196dc4c-52bb-7f60-9853-b0b12c6da401', dayId: 'd1' }
            ]
        };
        mockPrisma.user = { findUnique: jest.fn().mockResolvedValue({ id: 1 }) };
        mockPrisma.day.findMany.mockResolvedValueOnce([{ id: 'd1' }]);
        mockPrisma.bimbelPackage.create.mockResolvedValueOnce(fakeReturn);

        const result = await BimbelPackageService.createBimbelPackage({
            name: 'Matematika Mudah',
            level: 'SMA',
            totalMeetings: 4,
            time: '2025-03-24T19:00:00.000Z',
            duration: 120,
            area: 'Semarang',
            tutorId: 1,
            groupType: [
                { type: 'privat', price: 580000 },
                { type: 'grup2', price: 980000 },
                { type: 'grup3', price: 1380000 },
                { type: 'grup4', price: 1900000 },
                { type: 'grup5', price: 2340000 }
            ],
            days: ['Senin'],
            discount: 10
        });

        expect(result.data.groupType.find(gt => gt.type === 'privat').maxStudent).toBe("1");
        expect(result.data.groupType.find(gt => gt.type === 'grup2').maxStudent).toBe("2");
        expect(result.data.groupType.find(gt => gt.type === 'grup3').maxStudent).toBe("3");
        expect(result.data.groupType.find(gt => gt.type === 'grup4').maxStudent).toBe("4");
        expect(result.data.groupType.find(gt => gt.type === 'grup5').maxStudent).toBe("5");
    });

    it('getActiveBimbelPackages returns empty array if no active packages', async () => {
        mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
        const result = await BimbelPackageService.getActiveBimbelPackages();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('getAllBimbelPackages returns empty data if no packages', async () => {
        mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
        mockPrisma.bimbelPackage.count.mockResolvedValueOnce(0);
        const result = await BimbelPackageService.getAllBimbelPackages({ page: 1, pageSize: 10 });
        expect(result.data).toEqual([]);
        expect(result.total).toBe(0);
    });

    it('getBimbelPackageById returns null for invalid id', async () => {
        mockPrisma.bimbelPackage.findUnique.mockResolvedValueOnce(null);
        const result = await BimbelPackageService.getBimbelPackageById('invalid-id');
        expect(result).toBeNull();
    });

    it('deleteBimbelPackage throws if delete fails', async () => {
        mockPrisma.groupType.deleteMany.mockResolvedValueOnce();
        mockPrisma.packageDay.deleteMany.mockResolvedValueOnce();
        mockPrisma.bimbelPackage.delete.mockRejectedValueOnce(new Error('Delete failed'));
        await expect(BimbelPackageService.deleteBimbelPackage('fail-id')).rejects.toThrow('Delete failed');
    });

    it('getRunningPrograms returns empty array if no running classes', async () => {
        mockPrisma.class.findMany.mockResolvedValueOnce([]);
        const result = await BimbelPackageService.getRunningPrograms();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('getMyPackages returns empty array if tutor has no packages', async () => {
        mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
        const result = await BimbelPackageService.getMyPackages({ id: 1, role: 'tutor' });
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('getMyPackageById returns null if tutor has no such package', async () => {
        mockPrisma.bimbelPackage.findFirst.mockResolvedValueOnce(null);
        const result = await BimbelPackageService.getMyPackageById('notfound', { id: 1, role: 'tutor' });
        expect(result).toBeNull();
    });

    it('getMyProgramsStatistics returns 0 for empty studentClass', async () => {
        mockPrisma.studentClass.findMany.mockResolvedValueOnce([]);
        const result = await BimbelPackageService.getMyProgramsStatistics({ id: 1, role: 'siswa' });
        expect(result).toEqual({ runningClasses: 0, completedClasses: 0 });
    });

    it('getMyProgramsStatistics returns 0 for empty tutor classes', async () => {
        mockPrisma.class.findMany.mockResolvedValueOnce([]);
        mockPrisma.bimbelPackage.count.mockResolvedValueOnce(0);
        const result = await BimbelPackageService.getMyProgramsStatistics({ id: 1, role: 'tutor' });
        expect(result).toEqual({ runningClasses: 0, completedClasses: 0, activePackages: 0 });
    });

  it('getMyPackages returns groupType with discPrice null if discPrice is null', async () => {
    mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
      {
        id: 'pkgX',
        name: 'Paket Null Disc',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 90,
        area: 'Jakarta',
        isActive: true,
        groupType: [{ type: 'privat', price: 100000, discPrice: null }],
        packageDay: [{ day: { daysName: 'Senin' } }]
      }
    ]);
    const result = await BimbelPackageService.getMyPackages({ id: 1, role: 'tutor' });
    expect(result[0].groupType[0]).toHaveProperty('discPrice', null);
  });

  it('getMyPackageById returns groupType with discPrice null if discPrice is null', async () => {
    mockPrisma.bimbelPackage.findFirst.mockResolvedValueOnce({
      id: 'pkgX',
      name: 'Paket Null Disc',
      level: 'SMA',
      totalMeetings: 10,
      time: '10:00',
      duration: 90,
      area: 'Jakarta',
      isActive: true,
      groupType: [{ type: 'privat', price: 100000, discPrice: null }],
      packageDay: [{ day: { daysName: 'Senin' } }]
    });
    const result = await BimbelPackageService.getMyPackageById('pkgX', { id: 1, role: 'tutor' });
    expect(result.groupType[0]).toHaveProperty('discPrice', null);
  });
});