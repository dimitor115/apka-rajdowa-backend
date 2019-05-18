import { expect } from 'chai'
import { describe } from 'mocha'
import request from 'request-promise-native'
import fs from 'fs'
import url from './apiUrl'

export function event(name = 'Rajd', organisationId = 'w8', emailAlias = 'rajd-w8') {
    return {
        organisationId,
        name,
        emailAlias,
        startDate: '2018-04-01',
        endDate: '2018-05-01'
    }
}

describe('Events Api', () => {
    it('should insert new event and delete it successfully', async () => {
    // given
        const eventName = 'Rajd wiosenny'
        // when
        const insertResult = await insertEvent(event(eventName))
        const removeResult = await removeEvent(insertResult.data._id)
        // then
        expect(insertResult.data.name).to.equal(eventName)
        /* eslint-disable-next-line */
        expect(insertResult.data.logo).to.exist
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
        uri: url(`/api/v1/event/${eventId}`),
        body,
        json: true
    })
}

export async function removeEvent(eventId) {
    return request({
        method: 'DELETE',
        uri: url(`/api/v1/event/${eventId}`),
        json: true
    })
}

export async function insertEvent(body) {
    body.logo = fs.createReadStream('test/resources/test-logo.png')
    return request({
        method: 'POST',
        uri: url('/api/v1/event'),
        formData: body,
        json: true
    })
}

async function fetchAllEmailAliases() {
    return request({
        uri: url('/api/v1/event/email-aliases'),
        json: true
    })
}

async function fetchAllEvents(organisationId) {
    return request({
        uri: url(`/api/v1/event/all/${organisationId}`),
        json: true
    })
}
