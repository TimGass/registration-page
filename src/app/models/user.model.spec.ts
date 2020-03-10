import { User } from './user.model';

describe('User', () => {
  it('should create an instance.', () => {
    expect(
      new User({
        id: "dj19saqweqweqdasdasdas1-019iwjdqweq10ijd2",
        username: "yoloman2",
        email: "yolo2@swag.com",
        password: "something that would be enhashed"
      })
    ).toBeTruthy();
  });
});
