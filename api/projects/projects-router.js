const router = require('express').Router()
const Projects = require('./projects-model')

// Middleware to validate project exists
const validateProjectId = async (req, res, next) => {
  try {
    const project = await Projects.get(req.params.id)
    if (!project) {
      res.status(404).json({ message: 'Project not found' })
    } else {
      req.project = project
      next()
    }
  } catch (err) {
    next(err)
  }
}

// Middleware to validate project payload
const validateProject = (req, res, next) => {
  const { name, description, completed } = req.body
  if (!name || !description || completed === undefined) {
    res.status(400).json({ message: 'Missing required name, description or completed field' })
  } else {
    next()
  }
}
router.get('/', async (req, res, next) => {
  try {
    const projects = await Projects.get()
    res.json(projects)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', validateProjectId, async (req, res) => {
  res.json(req.project)
})

router.post('/', validateProject, async (req, res, next) => {
  try {
    const project = await Projects.insert(req.body)
    res.status(201).json(project)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', validateProjectId, validateProject, async (req, res, next) => {
  try {
    const updated = await Projects.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', validateProjectId, async (req, res, next) => {
  try {
    await Projects.remove(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
  try {
    const actions = await Projects.getProjectActions(req.params.id)
    res.json(actions)
  } catch (err) {
    next(err)
  }
})

module.exports = router