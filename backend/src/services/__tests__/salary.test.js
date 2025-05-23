import { jest } from '@jest/globals'

const mockPrisma = {
    salary: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn()
    },
    order: {
        findMany: jest.fn()
    },
    class: {
        count: jest.fn()
    }
}

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}))

const { SalaryService } = await import('../salary.js')

beforeEach(() => {
    jest.clearAllMocks()
})

describe('SalaryService', () => {
    describe('createSalary', () => {
        it('should create a salary record with pending status', async () => {
            const mockSalary = { id: 1, userId: 2, orderId: 3, total: 1000, status: 'pending' }
            mockPrisma.salary.create.mockResolvedValueOnce(mockSalary)

            const result = await SalaryService.createSalary({
                tutorId: 2,
                orderId: 3,
                totalSalary: 1000
            })

            expect(mockPrisma.salary.create).toHaveBeenCalledWith({
                data: { userId: 2, orderId: 3, total: 1000, status: 'pending' }
            })
            expect(result).toEqual(mockSalary)
        })
    })

    describe('updateSalaryStatus', () => {
        it('should update the status of a salary record', async () => {
            const mockSalary = { id: 1, status: 'paid' }
            mockPrisma.salary.update.mockResolvedValueOnce(mockSalary)

            const result = await SalaryService.updateSalaryStatus(1, 'paid')

            expect(mockPrisma.salary.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { status: 'paid' }
            })
            expect(result).toEqual(mockSalary)
        })
    })

    describe('getFinanceStats', () => {
        it('should return correct finance stats', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([
                { groupType: { discPrice: 2000, price: 2500 } },
                { groupType: { discPrice: null, price: 3000 } }
            ])
            mockPrisma.salary.findMany.mockResolvedValueOnce([
                { total: 1000 },
                { total: 2000 }
            ])
            mockPrisma.class.count.mockResolvedValueOnce(5)
            mockPrisma.salary.count.mockResolvedValueOnce(2)

            const stats = await SalaryService.getFinanceStats()

            expect(stats).toEqual({
                totalIncome: 5000,
                totalSalary: 3000,
                finishedClassCount: 5,
                pendingSalaryCount: 2
            })
        })

        it('should handle empty data gracefully', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([])
            mockPrisma.salary.findMany.mockResolvedValueOnce([])
            mockPrisma.class.count.mockResolvedValueOnce(0)
            mockPrisma.salary.count.mockResolvedValueOnce(0)

            const stats = await SalaryService.getFinanceStats()

            expect(stats).toEqual({
                totalIncome: 0,
                totalSalary: 0,
                finishedClassCount: 0,
                pendingSalaryCount: 0
            })
        })

        it('should handle orders without groupType and salaries with non-numeric total', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([
                { groupType: null },
                { groupType: { discPrice: undefined, price: undefined } }
            ])
            mockPrisma.salary.findMany.mockResolvedValueOnce([
                { total: 'abc' },
                { total: 2000 }
            ])
            mockPrisma.class.count.mockResolvedValueOnce(0)
            mockPrisma.salary.count.mockResolvedValueOnce(0)

            const stats = await SalaryService.getFinanceStats()

            expect(stats).toEqual({
                totalIncome: 0 + 0,
                totalSalary: 0 + 2000,
                finishedClassCount: 0,
                pendingSalaryCount: 0
            })
        })
    })

    describe('getFinanceRecap', () => {
        it('should return finance recap with correct fields', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([
                {
                    bimbelPackage: {
                        name: 'Paket A',
                        user: {
                            name: 'Budi',
                            tutors: [{ gender: 'Male' }]
                        }
                    },
                    class: [
                        {
                            code: 'CLS1',
                            status: 'selesai',
                            schedules: [
                                { meet: 1, date: '2024-01-01' },
                                { meet: 2, date: '2024-01-02' }
                            ]
                        },
                        {
                            code: 'CLS2',
                            status: 'pending',
                            schedules: []
                        }
                    ],
                    salary: [{ createdAt: '2024-01-10', status: 'pending' }]
                }
            ])

            const recap = await SalaryService.getFinanceRecap()

            expect(recap).toEqual([
                {
                    packageName: 'Paket A',
                    tutorName: 'Pak Budi',
                    classCode: 'CLS1',
                    startDate: '2024-01-01',
                    endDate: '2024-01-10',
                    salaryStatus: 'pending'
                }
            ])
        })

        it('should handle missing fields and non-selesai classes', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([
                {
                    bimbelPackage: null,
                    class: [
                        { code: null, status: 'selesai', schedules: [] }
                    ],
                    salary: []
                }
            ])

            const recap = await SalaryService.getFinanceRecap()

            expect(recap).toEqual([
                {
                    packageName: null,
                    tutorName: null,
                    classCode: null,
                    startDate: null,
                    endDate: null,
                    salaryStatus: null
                }
            ])
        })

        it('should set startDate to null if meet 1 is not found in schedules', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([
                {
                    bimbelPackage: {
                        name: 'Paket C',
                        user: {
                            name: 'Andi',
                            tutors: [{ gender: 'Male' }]
                        }
                    },
                    class: [
                        {
                            code: 'CLS4',
                            status: 'selesai',
                            schedules: [
                                { meet: 2, date: '2024-02-02' },
                                { meet: 3, date: '2024-02-03' }
                            ]
                        }
                    ],
                    salary: [{ createdAt: '2024-02-10', status: 'paid' }]
                }
            ])

            const recap = await SalaryService.getFinanceRecap()

            expect(recap).toEqual([
                {
                    packageName: 'Paket C',
                    tutorName: 'Pak Andi',
                    classCode: 'CLS4',
                    startDate: null,
                    endDate: '2024-02-10',
                    salaryStatus: 'paid'
                }
            ])
        })

        it('should set startDate to null if schedules is undefined', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([
                {
                    bimbelPackage: {
                        name: 'Paket D',
                        user: {
                            name: 'Dewi',
                            tutors: [{ gender: 'Female' }]
                        }
                    },
                    class: [
                        {
                            code: 'CLS5',
                            status: 'selesai',
                            schedules: undefined
                        }
                    ],
                    salary: [{ createdAt: '2024-03-10', status: 'pending' }]
                }
            ])

            const recap = await SalaryService.getFinanceRecap()

            expect(recap).toEqual([
                {
                    packageName: 'Paket D',
                    tutorName: 'Bu Dewi',
                    classCode: 'CLS5',
                    startDate: null,
                    endDate: '2024-03-10',
                    salaryStatus: 'pending'
                }
            ])
        })

        it('should skip classes that are not selesai', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([
                {
                    bimbelPackage: {
                        name: 'Paket B',
                        user: {
                            name: 'Siti',
                            tutors: [{ gender: 'Female' }]
                        }
                    },
                    class: [
                        { code: 'CLS3', status: 'pending', schedules: [] }
                    ],
                    salary: []
                }
            ])

            const recap = await SalaryService.getFinanceRecap()

            expect(recap).toEqual([])
        })
    })
})
