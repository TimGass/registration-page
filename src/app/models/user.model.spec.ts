import { User } from './user.model';

describe('User', () => {
  it('should create an instance.', () => {
    const user = new User({
      id: "dj19saqweqweqdasdasdas1-019iwjdqweq10ijd2",
      username: "yoloman2",
      email: "yolo2@swag.com",
      password: "something that would be enhashed"
    });
    expect(user).toBeTruthy();
    expect(user.id).toBe("dj19saqweqweqdasdasdas1-019iwjdqweq10ijd2");
    expect(user.username).toBe("yoloman2");
    expect(user.email).toBe("yolo2@swag.com");
    expect(user.password).toBe("something that would be enhashed");
  });
});
