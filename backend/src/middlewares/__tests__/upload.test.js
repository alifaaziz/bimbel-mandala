import { jest } from '@jest/globals';

const existsSync = jest.fn(() => false);
const mkdirSync = jest.fn();
jest.unstable_mockModule('fs', () => ({
  default: { existsSync, mkdirSync },
}));
const resolve = jest.fn(() => '/mocked/public/temp');
const extname = jest.fn((filename) => '.jpg');
jest.unstable_mockModule('path', () => ({
  default: { resolve, extname },
}));

const multerMock = jest.fn(() => ({}));
multerMock.diskStorage = jest.fn((opts) => opts);
jest.unstable_mockModule('multer', () => ({
  default: multerMock,
}));

const { upload } = await import('../upload.js');
const multer = (await import('multer')).default;

describe('upload middleware', () => {
  it('should create public/temp directory if not exists', () => {
    expect(resolve).toHaveBeenCalledWith('public', 'temp');
    expect(existsSync).toHaveBeenCalledWith('/mocked/public/temp');
    expect(mkdirSync).toHaveBeenCalledWith('/mocked/public/temp', { recursive: true });
  });

  it('should configure multer with correct storage', () => {
    expect(multer.diskStorage).toHaveBeenCalled();
    expect(multer).toHaveBeenCalledWith(expect.objectContaining({ storage: expect.any(Object) }));
  });

  it('should generate correct filename', () => {
    const storage = multer.diskStorage.mock.calls[0][0];
    const cb = jest.fn();
    const file = { originalname: 'test.jpg' };

    storage.filename({}, file, cb);

    expect(cb.mock.calls[0][1]).toMatch(/^temp-\d+\.jpg$/);
  });

  it('should call cb with tempDir in destination', () => {
    const storage = multer.diskStorage.mock.calls[0][0];
    const cb = jest.fn();
    const file = { originalname: 'test.jpg' };

    storage.destination({}, file, cb);

    expect(cb).toHaveBeenCalledWith(null, '/mocked/public/temp');
  });
  
  it('should NOT create public/temp directory if already exists', async () => {
    existsSync.mockReturnValueOnce(true);

    mkdirSync.mockClear();

    jest.resetModules();
    const multerMock2 = jest.fn(() => ({}));
    multerMock2.diskStorage = jest.fn((opts) => opts);
    jest.unstable_mockModule('multer', () => ({
      default: multerMock2,
    }));
    jest.unstable_mockModule('fs', () => ({
      default: { existsSync, mkdirSync },
    }));
    jest.unstable_mockModule('path', () => ({
      default: { resolve, extname },
    }));

    const { upload: upload2 } = await import('../upload.js');

    expect(existsSync).toHaveBeenCalledWith('/mocked/public/temp');
    expect(mkdirSync).not.toHaveBeenCalled();
  });
});