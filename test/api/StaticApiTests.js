import { expect } from 'chai'
import { describe } from 'mocha'
import request from 'request-promise-native'
import { insertEvent, removeEvent, event } from './EventsApiTests'
import apiUrl from './apiUrl'

describe('Static Api', () => {
    it('Should nie wiem co', async () => {
        /* eslint-disable */
        // prepare
        const insertResult = await insertEvent(event())
        expect(insertResult.data.logo).to.exist
        // given
        const { logo } = insertResult
        // when
        const img = await request(apiUrl(`/static/img/${logo}`))
        // then
        expect(img).to.exist
        // after
        const removeResult = await removeEvent(insertResult.data._id)
        expect(removeResult.data._id).to.equal(insertResult.data._id)
    })
})
