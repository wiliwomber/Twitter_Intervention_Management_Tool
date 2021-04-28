const jsonexport = require('jsonexport')
const { flatten } = require('flat')
const { omit } = require('lodash')

const exportData = async (data) => {
  const flattenedData = data.map((entry) => {
    // remove line breaks since the break csv format
    const string = JSON.stringify(entry)
    const withoutLineBreaks = string.replace(/\\n/g, ' ')
    return flatten(omit(JSON.parse(withoutLineBreaks), ['_id', '__v']))
  })
  const csv = await jsonexport(flattenedData)
  return csv
}

const ExportService = { exportData }
module.exports = ExportService
