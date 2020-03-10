import { UserMock } from './user-mock.model';

describe('UserMock', () => {
  it('should create an instance.', () => {
    expect(new UserMock()).toBeTruthy();
  });
});
