import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { User } from '../models/user.model';
import { uuid } from 'uuidv4';

import { ApiService } from './api.service';

describe('ApiService', async () => {
  let service: ApiService;
  const unique = uuid();
  const unique2 = uuid();
  const url = 'http://localhost:3000/users';
  const ourUser = new User({
    id: unique,
    username: "aevoamafasoaw2",
    email: "aevoamafasoaw2@swag.com",
    password: "something that would be enhashed"
  });

  const ourUser2 = new User({
    id: unique2,
    username: "acs2ecq23f1",
    email: "acs2ecq23f1@swag.com",
    password: "something that would be enhashed"
  });

  //If you have any errors related to testing, and the API service module in specific, make sure npm run database is being run in a terminal on your device!
  //many of these test depend on each other. Do NOT run in RANDOM ORDER!

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return errors with handleError method.', async () => {
    await Promise.all(
      [
        service.handleError(new HttpErrorResponse({
          error: new Error('test!'), status: 500,
          url: '/test/url/12d12', statusText: 'Internal server error!'
        }))
          .toPromise().catch(error => {
            expect(
              error.replace(/\s/g, '') === "Error Code: 500 Message: Http failure response for /test/url / 12d12: 500 Internal server error!".replace(/\s/g, '')
            ).toBeTruthy();
          }),
        service.handleError(new HttpErrorResponse({
          error: new Error('test42'), status: 404, url: '/url/test/1231',
          statusText: 'Resource not found!'
        }))
          .toPromise().catch(error => {
            expect(
              error.replace(/\s/g, '') === "Error Code: 404 Message: Http failure response for /url/test / 1231: 404 Resource not found!".replace(/\s/g, '')
            ).toBeTruthy();
          })
      ]
    );
  });

  it('should return a user from the getQuery method when valid and none when not.', async () => {
    await Promise.all(
      [
        service.getQuery('username=yoloman1').toPromise().then(payload => {
          expect(payload).toContain(jasmine.objectContaining({ username: "yoloman1"}));
        }),
        service.getQuery('username=yoloman2').toPromise().then(payload => {
          expect(payload).toContain(jasmine.objectContaining({ username: "yoloman2" }));
        }),
        service.getQuery('username=dsad21342134').toPromise().then(payload => {
          expect(Array.prototype.slice.call(payload).length).toEqual(0);
        }),
        service.getQuery('username=qweewd2341324').toPromise().then((payload) => {
          expect(Array.prototype.slice.call(payload).length).toEqual(0);
        }),
        service.getQuery('email=yolo@swag.com').toPromise().then(payload => {
          expect(payload).toContain(jasmine.objectContaining({ email: "yolo@swag.com" }));
        }),
        service.getQuery('email=yolo2@swag.com').toPromise().then(payload => {
          expect(payload).toContain(jasmine.objectContaining({ email: "yolo2@swag.com" }));
        }),
        service.getQuery('email=dsad21342134').toPromise().then(payload => {
          expect(Array.prototype.slice.call(payload).length).toEqual(0);
        }),
        service.getQuery('email=qweewd2341324').toPromise().then((payload) => {
          expect(Array.prototype.slice.call(payload).length).toEqual(0);
        }),
        service.getQuery('id=dj190wjd91iwjd0192wj1-9id1j019iwjd10ijd1').toPromise().then(payload => {
          expect(payload).toContain(jasmine.objectContaining({ id: "dj190wjd91iwjd0192wj1-9id1j019iwjd10ijd1" }));
        }),
        service.getQuery('id=dj19saqweqweqdasdasdas1-019iwjdqweq10ijd2').toPromise().then(payload => {
          expect(payload).toContain(jasmine.objectContaining({ id: "dj19saqweqweqdasdasdas1-019iwjdqweq10ijd2" }));
        }),
        service.getQuery('id=dsad21342134').toPromise().then(payload => {
          expect(Array.prototype.slice.call(payload).length).toEqual(0);
        }),
        service.getQuery('id=qweewd2341324').toPromise().then((payload) => {
          expect(Array.prototype.slice.call(payload).length).toEqual(0);
        })
      ]
    );
  });

  it('should send get request to target resource through sendGetRequestMethod and receive the payload.', async () => {
    //prevent timeout with test
    expect(ourUser).toBeTruthy();
    await service.sendGetRequest(url).toPromise().then(payload => {
      expect(payload.status).toEqual(200);
      expect(payload.url).toEqual(url);
      //In an ideal world I would check all items, but I don't think it's wise to programmatically check every user, nor do
      //I think that randomizing the indices is wise, as I am trying to stick with users that will hopefully still be defined.
      expect(Object.keys(payload.body[0]).sort()).toEqual(Object.keys(ourUser).sort());
      expect(Object.keys(payload.body[1]).sort()).toEqual(Object.keys(ourUser).sort());
      expect(Object.keys(payload.body[2]).sort()).toEqual(Object.keys(ourUser).sort());
    });
  });

  it('should post users with the sendPostRequest method.', async () => {
    expect(ourUser).toBeTruthy();
    expect(ourUser2).toBeTruthy();
    await Promise.all([
      service.sendPostRequest(ourUser).toPromise().then(payload => {
        expect(payload).toEqual(jasmine.objectContaining(ourUser));
      }),
      service.sendPostRequest(ourUser2).toPromise().then(payload => {
        expect(payload).toEqual(jasmine.objectContaining(ourUser2));
      })
    ]);
  });

  it('should find the posted users in the database.', async () => {
    expect(ourUser).toBeTruthy();
    expect(ourUser2).toBeTruthy();
    //setTimeout because server reloads on post.
    await new Promise(resolve => setTimeout(() => resolve(), 3000)).then(async () => {
      await Promise.all([
        service.sendGetRequest(`${url}/${unique}`).toPromise().then(payload => {
          expect(payload.body).toEqual(jasmine.objectContaining(ourUser));
        }),
        service.sendGetRequest(`${url}/${unique2}`).toPromise().then(payload => {
          expect(payload.body).toEqual(jasmine.objectContaining(ourUser2));
        })
      ]);
    });
  });

  it('should delete the posted users with the sendDeletRequest method.', async () => {
    expect(ourUser).toBeTruthy();
    expect(ourUser2).toBeTruthy();
    await Promise.all([
      service.sendDeleteRequest(unique).toPromise().then(payload => {
        expect(payload).toEqual({});
      }),
      service.sendDeleteRequest(unique2).toPromise().then(payload => {
        expect(payload).toEqual({});
      })
    ]);
  });
});
