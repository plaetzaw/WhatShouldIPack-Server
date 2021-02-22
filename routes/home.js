require('dotenv').config()
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const axios = require('axios')
const API_KEY = process.env.API_KEY

router.use(bodyParser.urlencoded({ extended: false }))

router.post('/search', async (req, res) => {
  const location = req.body.location
  const firstday = req.body.firstday
  const lastday = req.body.lastday
  const coldtemp = req.body.cold
  let coldcount = 0
  let warmcount = 0
  let snowcount = 0
  let raincount = 0
  let duration = 0
  const first = firstday.slice(0, 10)
  const last = lastday.slice(0, 10)

  const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${first}/${last}?key=${API_KEY}`

  try {
    console.log('Beginning query')
    console.log(location, first, last, coldtemp)
    const weather = await axios.get(URL)
    weather.data.days.forEach(e => {
      if (e.feelslike < coldtemp) {
        coldcount++
      }
      if (e.snow > 0) {
        snowcount++
      }
      if (e.precipprob > 0.20) {
        raincount++
      }
    })
    const duration = (weather.data.days.length)
    const warmcount = duration - coldcount
    const packingInfo = {
      weather: weather.data,
      coldcount,
      warmcount,
      snowcount,
      raincount,
      duration
    }
    console.log(packingInfo)
    res.status(200).send(packingInfo)
  } catch (e) {
    res.status(500).json({ message: 'An error has occured', error: e })
  }
})

module.exports = router
