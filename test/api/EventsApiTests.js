import chai from 'chai'
import { describe } from 'mocha'
import request from 'request-promise-native'
import url from './apiUrl'

const { expect } = chai

describe('Events Api tests', () => {
  it('should get all events for organisation', async () => {
    // given
    const organisationId = 'w1'
    // when
    const result = await fetchAllStudents(organisationId)
    // then
    expect(result.data.length).to.be.at.least(1)
    expect(result.data[0].organisationId).to.equal(organisationId)
  })
})

async function fetchAllStudents(organisationId) {
  return request({
    uri: url(`events/all/${organisationId}`),
    json: true
  })
}
