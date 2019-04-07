import chai from 'chai'
import { describe } from 'mocha'
import request from 'request-promise-native'
import url from './apiUrl'

const { expect } = chai

const event = (name = 'Rajd', organisationId = 'w8', emailAlias = 'rajd-w8') => ({
  organisationId,
  name,
  emailAlias,
  startDate: '2018-04-01',
  endDate: '2018-05-01',
  logo: 'tmp'
})

describe('Events Api tests', () => {
  it('should insert new event and delete it successfully', async () => {
    // given
    const eventName = 'Rajd wiosenny'
    // when
    const insertResult = await insertEvent(event(eventName))
    const removeResult = await removeEvent(insertResult.data._id)
    // then
    expect(insertResult.data.name).to.equal(eventName)
    expect(removeResult.data._id).to.equal(insertResult.data._id)
  })
  it('should update event', async () => {
    // given
    const changedName = 'Nowa nazwa'
    const eventId = (await insertEvent(event('Rajd jesienny'))).data._id
    // when
    const result = await updateEvent(eventId, { name: changedName })
    // then
    expect(result.data.name).to.equal(changedName)
    // clean
    await removeEvent(eventId)
  })
  it('should get all events for organisation', async () => {
    // given
    const organisationId = 'w7'
    const eventId = (await insertEvent(event('Rajd', organisationId))).data._id
    // when
    const result = await fetchAllEvents(organisationId, eventId)
    // then
    expect(result.data.length).to.be.at.least(1)
    expect(result.data[0].organisationId).to.equal(organisationId)
    // clean
    await removeEvent(eventId)
  })
  it('should get all email aliases', async () => {
    // given
    const emailAlias = 'rajd-supper'
    const eventId = (await insertEvent(event('Rajd', 'w1', emailAlias))).data._id
    // when
    const result = await fetchAllEmailAliases()
    // then
    expect(result.data.length).to.be.at.least(1)
    expect(result.data).to.include(emailAlias)
    // clean
    await removeEvent(eventId)
  })
})
async function updateEvent(eventId, body) {
  return request({
    method: 'PUT',
    uri: url(`events/${eventId}`),
    body,
    json: true
  })
}

async function removeEvent(eventId) {
  return request({
    method: 'DELETE',
    uri: url(`events/${eventId}`),
    json: true
  })
}

async function insertEvent(body) {
  return request({
    method: 'POST',
    uri: url('events'),
    body,
    json: true
  })
}

async function fetchAllEmailAliases() {
  return request({
    uri: url('events/email-aliases'),
    json: true
  })
}

async function fetchAllEvents(organisationId) {
  return request({
    uri: url(`events/all/${organisationId}`),
    json: true
  })
}
