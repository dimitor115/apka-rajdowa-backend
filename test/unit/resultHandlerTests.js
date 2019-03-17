import chai from 'chai'
import { describe } from 'mocha'
import resultHandler from '../../server/middlewares/'

const { expect } = chai

describe('Examples', () => {
  it('should get all examples', () => {
    const res = {
      send: value => {
        console.log(value)
      },
      code: value => {
        console.log(value)
      },
      json: value => {
        console.log(value)
      }
    }
    const testMethod = async () => {
    }
  })
})
