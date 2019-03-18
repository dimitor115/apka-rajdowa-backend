import chai from 'chai'
import { describe } from 'mocha'
import Response from '../../server/common/utils/Response'
import Exception from '../../server/common/utils/Exception'
import resultHandler from '../../server/middlewares/resultHandler'

const { expect } = chai

describe('ResultHandler unit tests', () => {
  it('should properly map custom Response object to http response', () => {
    const testMsg = 'message'
    const testPayload = { value: 'test' }
    const testCode = 201
    const resMock = {
      status: value => {
        expect(value).to.be.equal(testCode)
        return resMock
      },
      json: value => {
        expect(value.data.value).to.be.equal(testPayload.value)
        expect(value.messages).to.include(testMsg)
      }
    }
    const testMethod = async () => new Response(testPayload, testCode, testMsg)
    const handlerInstance = resultHandler(() => testMethod())
    handlerInstance(null, resMock)
  })

  it('should properly map any object to http response', () => {
    const testPayload = { value: 'test' }
    const resMock = {
      json: value => {
        expect(value.value).to.be.equal(testPayload.value)
      }
    }
    const testMethod = async () => testPayload
    const handlerInstance = resultHandler(() => testMethod())
    handlerInstance(null, resMock)
  })

  it('should properly map thrown exception to http error response', () => {
    const testMsg = 'message'
    const testCode = 400
    const resMock = {
      status: value => {
        expect(value).to.be.equal(testCode)
        return resMock
      },
      send: value => {
        expect(value.messages).to.include(testMsg)
      }
    }
    const testMethod = async () => { throw new Exception(testMsg, testCode) }
    const handlerInstance = resultHandler(() => testMethod())
    handlerInstance(null, resMock)
  })

  it('should properly map thrown any error to http error response', () => {
    const testMsg = 'message'
    const testCode = 500
    const resMock = {
      status: value => {
        expect(value).to.be.equal(testCode)
        return resMock
      },
      send: value => {
        expect(value.message).to.include(testMsg)
      }
    }
    const testMethod = async () => { throw Error(testMsg) }
    const handlerInstance = resultHandler(() => testMethod())
    handlerInstance(null, resMock)
  })
})
