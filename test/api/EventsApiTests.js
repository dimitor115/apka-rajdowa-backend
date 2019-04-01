import chai from 'chai'
import { describe } from 'mocha'
import request from 'request'
import url from 'apiUrl'
const { expect } = chai

describe('Events Api tests', () => {
  it('should get all events for organisation', () => {
    const organisationId = 'w1'
    request.get({

    })
  })

  // it('should add a new example', () => request(Server)
  //   .post('/api/v1/examples')
  //   .send({ name: 'test' })
  //   .expect('Content-Type', /json/)
  //   .then(r => {
  //     expect(r.body.data)
  //       .to.be.an.an('object')
  //       .that.has.property('name')
  //       .equal('test')
  //   }))
})
