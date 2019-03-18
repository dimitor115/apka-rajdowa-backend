const Joi = require('joi')

function fromJson(jsonFields) {
  const keys = jsonFields.reduce((acc, field) => {
    const key = field.label.trim()
      .replace(' ', '_')
      .toLocaleLowerCase()
    acc[key] = parseTypeToJoi(field)
    return acc
  }, {})
  const joiSchema = Joi.object()
    .keys(keys)
  console.log(JSON.stringify(Joi.describe(joiSchema)))
}

function parseTypeToJoi(field) {
  let result = Joi
  switch (field.type) {
    case 'text':
      result = result.string()
      break
    case 'indeks':
      result = result.string()
        .min(6)
        .max(6)
      break
    case 'email':
      result = result.string().email()
      break
    default:
      result = result.number()
  }
  return result
}

const schema = {
  fields: [
    {
      label: 'Indeks',
      type: 'indeks',
      pattern: null,
      required: true
    },
    {
      label: 'Imie',
      type: 'text',
      required: true
    },
    {
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      label: 'Numer telefonu',
      type: 'phoneNumber'
    },
    {
      label: 'Dieta',
      type: 'enum',
      values: ['Vege', 'Mięsna', 'Wegetarniańska', 'Frutariańska'],
      required: true
    },
    {
      label: 'Akceptacja regulaminu',
      type: '?'
    }
  ]
}

fromJson(schema.fields)
