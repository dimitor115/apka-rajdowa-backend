import Exception from '../common/utils/Exception'

class ExamplesDatabase {
  constructor() {
    this._data = []
    this._counter = 0

    this.insert('example 0')
    this.insert('example 1')
  }

  all() {
    return Promise.resolve(this._data)
  }

  byId(id) {
    if (id > this._counter) {
      throw new Exception(`Element with id ${id} doesn't exist`)
    } else {
      return Promise.resolve(this._data[id])
    }
  }

  insert(name) {
    const record = {
      id: this._counter,
      name
    }

    this._counter += 1
    this._data.push(record)

    return Promise.resolve(record)
  }
}

export default new ExamplesDatabase()
