import { jest } from '@jest/globals';
import { generatePrismaMock } from '../../utils/jest.js';

const mockPrisma = generatePrismaMock();

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma.prisma,
}));

jest.unstable_mockModule('crypto', () => ({
  default: {
    randomBytes: () => ({
      toString: () => 'abcdef'
    })
  }
}));

const { ClassService } = await import('../class.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ClassService', () => {
  describe('createClass', () => {
    it('should throw if order not found', async () => {
      mockPrisma.prisma.order.findUnique.mockResolvedValueOnce(null);
      await expect(ClassService.createClass({ orderId: 1 })).rejects.toThrow('Order not found');
    });

    it('should create class and studentClass', async () => {
      mockPrisma.prisma.order.findUnique.mockResolvedValueOnce({
        id: 1,
        userId: 10,
        bimbelPackage: { userId: 20 },
        groupType: { maxStudent: 5 }
      });
      mockPrisma.prisma.class.create.mockResolvedValueOnce({ id: 100, code: 'ABCDEF' });
      mockPrisma.prisma.studentClass.createMany.mockResolvedValueOnce({});
      const result = await ClassService.createClass({ orderId: 1 });
      expect(mockPrisma.prisma.class.create).toHaveBeenCalledWith({
        data: { code: expect.any(String), orderId: 1, tutorId: 20, status: 'berjalan', maxStudents: 5 }
      });
      expect(mockPrisma.prisma.studentClass.createMany).toHaveBeenCalledWith({
        data: [{ userId: 10, classId: 100 }]
      });
      expect(result).toHaveProperty('id', 100);
    });
  });

  describe('joinClass', () => {
    it('should throw if code starts with CLS', async () => {
      await expect(ClassService.joinClass({ code: 'CLS123', userId: 1 }))
        .rejects.toThrow('You cannot join this class manually.');
    });

    it('should throw if class not found', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce(null);
      await expect(ClassService.joinClass({ code: 'ABC', userId: 1 }))
        .rejects.toThrow('Class not found');
    });

    it('should throw if class is full', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({ id: 2, maxStudents: 1 });
      mockPrisma.prisma.studentClass.count.mockResolvedValueOnce(1);
      await expect(ClassService.joinClass({ code: 'ABC', userId: 1 }))
        .rejects.toThrow('Class is full');
    });

    it('should throw if user already in class', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({ id: 2, maxStudents: 2 });
      mockPrisma.prisma.studentClass.count.mockResolvedValueOnce(1);
      mockPrisma.prisma.studentClass.findFirst.mockResolvedValueOnce({ id: 3 });
      await expect(ClassService.joinClass({ code: 'ABC', userId: 1 }))
        .rejects.toThrow('User is already in the class');
    });

    it('should create studentClass and notification if not already joined', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 2,
        maxStudents: 2,
        code: 'ABC',
        order: { bimbelPackage: { name: 'Paket', level: 'SMA' } },
        tutor: { name: 'Budi', tutors: [{ gender: 'Male' }], photo: 'photo.jpg' }
      });
      mockPrisma.prisma.studentClass.count.mockResolvedValueOnce(1);
      mockPrisma.prisma.studentClass.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.studentClass.create.mockResolvedValueOnce({ id: 4, userId: 1, classId: 2 });
      mockPrisma.prisma.notification.create.mockResolvedValueOnce({});
      const result = await ClassService.joinClass({ code: 'ABC', userId: 1 });
      expect(mockPrisma.prisma.studentClass.create).toHaveBeenCalledWith({
        data: { userId: 1, classId: 2 }
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          type: 'Program',
          description: expect.stringContaining('Selamat, Anda telah bergabung'),
          photo: 'photo.jpg'
        }
      });
      expect(result).toMatchObject({ id: 4, userId: 1, classId: 2 });
    });

    it('should set programName to null in notification if bimbelPackage is null', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 2,
        maxStudents: 2,
        code: 'ABC',
        order: { bimbelPackage: null },
        tutor: { name: 'Budi', tutors: [{ gender: 'Male' }], photo: 'photo.jpg' }
      });
      mockPrisma.prisma.studentClass.count.mockResolvedValueOnce(0);
      mockPrisma.prisma.studentClass.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.studentClass.create.mockResolvedValueOnce({ id: 4, userId: 1, classId: 2 });
      mockPrisma.prisma.notification.create.mockResolvedValueOnce({});

      await ClassService.joinClass({ code: 'ABC', userId: 1 });

      // Cek bahwa programName di deskripsi notifikasi adalah 'null'
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          description: expect.stringContaining('<strong>null #ABC</strong>')
        })
      });
    });
  });

  describe('getMyClass', () => {
    it('should return mapped class data with all fields for siswa', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            status: 'aktif',
            tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
            order: {
              groupType: { type: 'Reguler' },
              bimbelPackage: {
                name: 'Paket A',
                slug: 'paket-a',
                level: 'SMA',
                time: '10:00',
                duration: 90,
                packageDay: [
                  { day: { daysName: 'Senin' } },
                  { day: { daysName: 'Rabu' } }
                ]
              }
            }
          }
        }
      ]);
      const result = await ClassService.getMyClass('user1', 'siswa');
      expect(result[0]).toMatchObject({
        status: 'aktif',
        tutorName: 'Pak Budi',
        programName: 'Paket A SMA',
        slug: 'paket-a',
        groupType: 'Reguler',
        days: 'Senin, Rabu',
        time: '10:00',
        duration: 90
      });
    });

    it('should handle missing tutor and packageDay for siswa', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            status: 'aktif',
            tutor: {},
            order: {
              groupType: null,
              bimbelPackage: {
                name: 'Paket B',
                level: 'SMP',
                slug: 'paket-b',
                time: null,
                duration: null,
                packageDay: null
              }
            }
          }
        }
      ]);
      const result = await ClassService.getMyClass('user2', 'siswa');
      expect(result[0]).toMatchObject({
        status: 'aktif',
        tutorName: 'Bu undefined',
        programName: 'Paket B SMP',
        slug: 'paket-b',
        groupType: null,
        days: null,
        time: null,
        duration: null
      });
    });

    it('should return mapped class data for tutor', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          status: 'berjalan',
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] },
          order: {
            groupType: { type: 'Privat' },
            bimbelPackage: {
              name: 'Paket C',
              slug: 'paket-c',
              level: 'SD',
              time: '08:00',
              duration: 60,
              packageDay: [
                { day: { daysName: 'Selasa' } }
              ]
            }
          }
        }
      ]);
      const result = await ClassService.getMyClass('tutor1', 'tutor');
      expect(result[0]).toMatchObject({
        status: 'berjalan',
        tutorName: 'Bu Siti',
        programName: 'Paket C SD',
        slug: 'paket-c',
        groupType: 'Privat',
        days: 'Selasa',
        time: '08:00',
        duration: 60
      });
    });

    it('should handle missing groupType and packageDay for tutor', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          status: 'berjalan',
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] },
          order: {
            groupType: null,
            bimbelPackage: {
              name: 'Paket D',
              slug: 'paket-d',
              level: 'SMP',
              time: null,
              duration: null,
              packageDay: null
            }
          }
        }
      ]);
      const result = await ClassService.getMyClass('tutor2', 'tutor');
      expect(result[0]).toMatchObject({
        status: 'berjalan',
        tutorName: 'Bu Siti',
        programName: 'Paket D SMP',
        slug: 'paket-d',
        groupType: null,
        days: null,
        time: null,
        duration: null
      });
    });

    it('should set programName and slug to null if bimbelPackage is null (siswa)', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            status: 'aktif',
            tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
            order: {
              groupType: { type: 'Reguler' },
              bimbelPackage: null
            }
          }
        }
      ]);
      const result = await ClassService.getMyClass('user3', 'siswa');
      expect(result[0]).toMatchObject({
        programName: null,
        slug: null
      });
    });

    it('should set programName and slug to null if bimbelPackage is null (tutor)', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          status: 'berjalan',
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] },
          order: {
            groupType: { type: 'Privat' },
            bimbelPackage: null
          }
        }
      ]);
      const result = await ClassService.getMyClass('tutor3', 'tutor');
      expect(result[0]).toMatchObject({
        programName: null,
        slug: null
      });
    });
  });

  describe('getRunningClass', () => {
    it('should return running classes with tutor and program info', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          tutor: { name: 'Budi' },
          order: { bimbelPackage: { name: 'Paket A', level: 'SMA' } },
          code: 'ABC',
          status: 'berjalan'
        }
      ]);
      const result = await ClassService.getRunningClass();
      expect(result[0]).toMatchObject({
        tutorName: 'Budi',
        programName: 'Paket A',
        level: 'SMA',
        classCode: 'ABC'
      });
    });

    it('should handle missing tutor and program', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          tutor: null,
          order: { bimbelPackage: null },
          code: 'DEF',
          status: 'berjalan'
        }
      ]);
      const result = await ClassService.getRunningClass();
      expect(result[0]).toMatchObject({
        tutorName: 'Tidak ada tutor',
        programName: 'Tidak ada program',
        level: 'Tidak ada level',
        classCode: 'DEF'
      });
    });
  });

  describe('getStudentClassesByUserId', () => {
    it('should return student classes with all fields', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            status: 'aktif',
            code: 'C1',
            tutor: { name: 'Budi' },
            order: {
              groupType: { type: 'Reguler' },
              bimbelPackage: {
                name: 'Paket A',
                level: 'SMA',
                time: '10:00',
                duration: 90,
                packageDay: [
                  { day: { daysName: 'Senin' } },
                  { day: { daysName: 'Rabu' } }
                ]
              }
            }
          }
        }
      ]);
      const result = await ClassService.getStudentClassesByUserId('user1');
      expect(result[0]).toMatchObject({
        programName: 'Paket A',
        level: 'SMA',
        tutorName: 'Budi',
        status: 'aktif',
        groupType: 'Reguler',
        days: 'Senin, Rabu',
        time: '10:00',
        duration: 90,
        code: 'C1'
      });
    });

    it('should handle missing groupType and packageDay', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            status: 'aktif',
            code: 'C2',
            tutor: { name: 'Budi' },
            order: {
              groupType: null,
              bimbelPackage: {
                name: 'Paket B',
                level: 'SMP',
                time: null,
                duration: null,
                packageDay: null
              }
            }
          }
        }
      ]);
      const result = await ClassService.getStudentClassesByUserId('user2');
      expect(result[0]).toMatchObject({
        programName: 'Paket B',
        level: 'SMP',
        tutorName: 'Budi',
        status: 'aktif',
        groupType: null,
        days: null,
        time: null,
        duration: null,
        code: 'C2'
      });
    });

    it('should set programName, level, and tutorName to null if bimbelPackage and tutor are missing', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            status: 'aktif',
            code: 'C3',
            tutor: null,
            order: {
              groupType: null,
              bimbelPackage: null
            }
          }
        }
      ]);
      const result = await ClassService.getStudentClassesByUserId('user3');
      expect(result[0]).toMatchObject({
        programName: null,
        level: null,
        tutorName: null,
        status: 'aktif',
        groupType: null,
        days: null,
        time: null,
        duration: null,
        code: 'C3'
      });
    });
  });

  describe('getFinishedClasses', () => {
    it('should return finished classes with all fields', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          tutor: { name: 'Budi' },
          order: {
            address: 'Jl. Mawar',
            groupType: { type: 'Reguler', price: 100000, discPrice: 90000, maxStudent: 2 },
            bimbelPackage: {
              name: 'Paket A',
              level: 'SMA',
              time: '10:00',
              duration: 90,
              packageDay: [
                { day: { daysName: 'Senin' } },
                { day: { daysName: 'Rabu' } }
              ]
            },
            salary: [{ total: 50000, status: 'paid' }]
          },
          studentClasses: [
            { user: { name: 'Student A' } },
            { user: { name: 'Student B' } }
          ],
          status: 'selesai'
        }
      ]);
      const result = await ClassService.getFinishedClasses();
      expect(result[0]).toMatchObject({
        programName: 'Paket A',
        tutorName: 'Budi',
        level: 'SMA',
        days: 'Senin, Rabu',
        time: '10:00',
        address: 'Jl. Mawar',
        status: 'selesai',
        students: ['Student A', 'Student B'],
        groupType: {
          type: 'Reguler',
          price: 90000,
          maxStudent: 2,
          studentPrice: 45000
        },
        salary: {
          total: 50000,
          status: 'paid'
        }
      });
    });

    it('should handle missing groupType, bimbelPackage, salary, and students', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          tutor: null,
          order: {
            address: null,
            groupType: null,
            bimbelPackage: null,
            salary: []
          },
          studentClasses: [],
          status: 'selesai'
        }
      ]);
      const result = await ClassService.getFinishedClasses();
      expect(result[0]).toMatchObject({
        programName: null,
        tutorName: null,
        level: null,
        days: null,
        time: null,
        address: null,
        status: 'selesai',
        students: [],
        groupType: {
          type: null,
          price: null,
          maxStudent: 1,
          studentPrice: 0
        },
        salary: {
          total: 0,
          status: null
        }
      });
    });

    it('should return students as [] if studentClasses is missing', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          tutor: { name: 'Budi' },
          order: {
            address: 'Jl. Mawar',
            groupType: { type: 'Reguler', price: 100000, discPrice: 90000, maxStudent: 2 },
            bimbelPackage: {
              name: 'Paket A',
              level: 'SMA',
              time: '10:00',
              duration: 90,
              packageDay: [
                { day: { daysName: 'Senin' } },
                { day: { daysName: 'Rabu' } }
              ]
            },
            salary: [{ total: 50000, status: 'paid' }]
          },
          status: 'selesai'
        }
      ]);
      const result = await ClassService.getFinishedClasses();
      expect(result[0].students).toEqual([]);
    });
  });
});
