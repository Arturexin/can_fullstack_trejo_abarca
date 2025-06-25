import express from 'express'
import multer from 'multer'
import { uploadFile, getFiles, getFileLinks } from '../controllers/fileController.js'
import { auth } from '../middleware/auth.js'

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.post('/upload', auth, upload.single('file'), uploadFile)
router.get('/files', auth, getFiles)
router.get('/files/:fileId/links', auth, getFileLinks)

export default router
