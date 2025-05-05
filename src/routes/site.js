import express from 'express'

import {
  renderHome,
  renderAbout,
  renderEvents,
  renderQualifications
} from '../controllers/siteController.js'

const router = express.Router()

router.get('/', renderHome)
router.get('/om-oss', renderAbout)
router.get('/event', renderEvents)
router.get('/kvalifikationer', renderQualifications)

export default router
