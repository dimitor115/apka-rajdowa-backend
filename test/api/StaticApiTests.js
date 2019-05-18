import { expect } from 'chai'
import { describe } from 'mocha'
import request from 'request-promise-native'
import apiUrl from './apiUrl'
import { insertEvent, removeEvent, event } from './EventsApiTests'

describe('Static Api', () => {
    it('Should download event logo file', async () => {
        /* eslint-disable */
        // prepare
        const insertResult = await insertEvent(event())
        expect(insertResult.data.logo).to.exist
        // given
        const { logo } = insertResult.data
        // when
        const img = await request(apiUrl(`/api/v1${logo}`))
        // then
        expect(img).to.exist
        // after
        const removeResult = await removeEvent(insertResult.data._id)
        expect(removeResult.data._id)
            .to
            .equal(insertResult.data._id)
    })
})
