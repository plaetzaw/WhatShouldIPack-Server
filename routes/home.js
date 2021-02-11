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
  const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${firstday}/${lastday}?key=${API_KEY}`

  try {
    const weather = axios.get(URL)
    console.log(weather)
    res.status(200).send(weather)
  } catch (e) {
    res.status(500).json({ message: 'An error has occured', error: e })
  }
})
