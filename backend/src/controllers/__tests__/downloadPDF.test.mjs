import { jest } from '@jest/globals'

jest.unstable_mockModule('../../services/attendance.js', () => ({
  AttendanceService: {
    getRekapKelasById: jest.fn()
  }
}))

const {
  setupPuppeteerMock,
  setupFsMock,
  setupExpressMock
} = await import('../../utils/jest.js')

const { puppeteerMock, mockBrowser, mockPage } = setupPuppeteerMock()
setupFsMock()

jest.unstable_mockModule('puppeteer', () => ({
  default: puppeteerMock
}))

const { AttendanceController } = await import('../attendance.js')
const { AttendanceService } = await import('../../services/attendance.js')

describe('AttendanceController', () => {
  it('should generate and send a PDF for class rekap', async () => {
    AttendanceService.getRekapKelasById.mockResolvedValue({
      classId: 'class1',
      printDate: 'mocked-date'
    })

    const { req, res } = setupExpressMock({
      req: { params: { classId: 'class1' } }
    })

    await AttendanceController.downloadRekapPDF(req, res)

    expect(AttendanceService.getRekapKelasById).toHaveBeenCalledWith('class1')
  })
})