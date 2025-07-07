import { jest } from '@jest/globals';

jest.unstable_mockModule('../../services/user.js', () => ({
  UserService: {
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getTutorsSortedByClassCount: jest.fn(),
    getTopStudents: jest.fn(),
    getNewStudents: jest.fn(),
    getStatistics: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

const { UserController } = await import('../user.js');
const { UserService } = await import('../../services/user.js');

function setupExpressMock({ req = {}, res = {} } = {}) {
  const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    locals: res.locals || {},
  };
  return { req, res: resMock };
}

describe('UserController', () => {
  afterEach(() => jest.clearAllMocks());

  it('getCurrentUser returns user data', async () => {
    const user = { id: 'user1', name: 'Test User' };
    UserService.getUserById.mockResolvedValue(user);

    const { req, res } = setupExpressMock({ res: { locals: { user: { id: 'user1' } } } });
    await UserController.getCurrentUser(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith('user1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: user });
  });

  it('createUser returns created user', async () => {
    const user = { id: 'user2', name: 'New User' };
    UserService.createUser.mockResolvedValue(user);

    const { req, res } = setupExpressMock({ req: { body: { name: 'New User' } } });
    await UserController.createUser(req, res);

    expect(UserService.createUser).toHaveBeenCalledWith({ name: 'New User' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: user });
  });

  it('updateCurrentUser returns success message', async () => {
    UserService.updateUser.mockResolvedValue();

    const { req, res } = setupExpressMock({
      req: { body: { name: 'Updated' }, file: undefined },
      res: { locals: { user: { id: 'user1', role: 'student' } } },
    });
    await UserController.updateCurrentUser(req, res);

    expect(UserService.updateUser).toHaveBeenCalledWith(
      { id: 'user1', role: 'student', name: 'Updated' },
      undefined
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
  });

  it('updateUserById returns success message', async () => {
    UserService.updateUser.mockResolvedValue();

    const { req, res } = setupExpressMock({
      req: { params: { id: 'user2' }, body: { name: 'Admin Edit', role: 'admin' }, file: undefined },
    });
    await UserController.updateUserById(req, res);

    expect(UserService.updateUser).toHaveBeenCalledWith(
      { id: 'user2', name: 'Admin Edit', role: 'admin' },
      undefined
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
  });

  it('getTutorsSortedByClassCount returns tutors', async () => {
    const tutors = [{ id: 't1' }];
    UserService.getTutorsSortedByClassCount.mockResolvedValue(tutors);

    const { req, res } = setupExpressMock({ req: { query: { page: '1', limit: '10' } } });
    await UserController.getTutorsSortedByClassCount(req, res);

    expect(UserService.getTutorsSortedByClassCount).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tutors);
  });

  it('getTutorsSortedByClassCount uses default pagination if query missing', async () => {
    const tutors = [{ id: 't1' }];
    UserService.getTutorsSortedByClassCount.mockResolvedValue(tutors);

    // query kosong
    const { req, res } = setupExpressMock({ req: { query: {} } });
    await UserController.getTutorsSortedByClassCount(req, res);

    expect(UserService.getTutorsSortedByClassCount).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tutors);
  });

  it('getTutorsSortedByClassCount parses page and limit as int', async () => {
    const tutors = [{ id: 't2' }];
    UserService.getTutorsSortedByClassCount.mockResolvedValue(tutors);

    // query dengan string angka
    const { req, res } = setupExpressMock({ req: { query: { page: '3', limit: '7' } } });
    await UserController.getTutorsSortedByClassCount(req, res);

    expect(UserService.getTutorsSortedByClassCount).toHaveBeenCalledWith({ page: 3, pageSize: 7 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tutors);
  });

  it('getTopStudents returns students', async () => {
    const students = [{ id: 's1' }];
    UserService.getTopStudents.mockResolvedValue(students);

    const { req, res } = setupExpressMock();
    await UserController.getTopStudents(req, res);

    expect(UserService.getTopStudents).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: students });
  });

  it('getNewStudents returns new students', async () => {
    const students = [{ id: 's2' }];
    UserService.getNewStudents.mockResolvedValue(students);

    const { req, res } = setupExpressMock({ req: { query: { page: '2', limit: '5', search: 'abc' } } });
    await UserController.getNewStudents(req, res);

    expect(UserService.getNewStudents).toHaveBeenCalledWith({ page: 2, pageSize: 5, searchText: 'abc' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: students });
  });

  it('getNewStudents uses default pagination and searchText if query missing', async () => {
    const students = [{ id: 's3' }];
    UserService.getNewStudents.mockResolvedValue(students);

    // query kosong
    const { req, res } = setupExpressMock({ req: { query: {} } });
    await UserController.getNewStudents(req, res);

    expect(UserService.getNewStudents).toHaveBeenCalledWith({ page: 1, pageSize: 10, searchText: '' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: students });
  });

  it('getNewStudents parses page, limit, and search', async () => {
    const students = [{ id: 's4' }];
    UserService.getNewStudents.mockResolvedValue(students);

    // query lengkap
    const { req, res } = setupExpressMock({ req: { query: { page: '5', limit: '2', search: 'abc' } } });
    await UserController.getNewStudents(req, res);

    expect(UserService.getNewStudents).toHaveBeenCalledWith({ page: 5, pageSize: 2, searchText: 'abc' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: students });
  });

  it('getStatistics returns statistics', async () => {
    const stats = { total: 10 };
    UserService.getStatistics.mockResolvedValue(stats);

    const { req, res } = setupExpressMock();
    await UserController.getStatistics(req, res);

    expect(UserService.getStatistics).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: stats });
  });

  it('getUserById returns user data', async () => {
    const user = { id: 'user3' };
    UserService.getUserById.mockResolvedValue(user);

    const { req, res } = setupExpressMock({ req: { params: { id: 'user3' } } });
    await UserController.getUserById(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith('user3');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: user });
  });

  it('deleteUser returns success message', async () => {
    UserService.deleteUser.mockResolvedValue();

    const { req, res } = setupExpressMock({ req: { params: { id: 'user4' } } });
    await UserController.deleteUser(req, res);

    expect(UserService.deleteUser).toHaveBeenCalledWith('user4');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
  });
});