const router = require('express').Router()
const Actions = require('./actions-model')
const Projects = require('../projects/projects-model')

// Middleware to validate action exists
const validateActionId = async (req, res, next) => {
  try {
    const action = await Actions.get(req.params.id)
    if (!action) {
      res.status(404).json({ message: 'Action not found' })
    } else {
      req.action = action
      next()
    }
  } catch (err) {
    next(err)
  }
}

// Middleware to validate action payload
const validateAction = async (req, res, next) => {
  const { project_id, description, notes } = req.body
  if (!project_id || !description || !notes) {
    res.status(400).json({ message: 'Missing required fields' })
  } else {
    try {
      const project = await Projects.get(project_id)
      if (!project) {
        res.status(400).json({ message: 'Project does not exist' })
      } else {
        next()
      }
    } catch (err) {
      next(err)
    }
  }
}

router.get('/', async (req, res, next) => {
  try {
    const actions = await Actions.get()
    res.json(actions)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', validateActionId, async (req, res) => {
  res.json(req.action)
})

router.post('/', validateAction, async (req, res, next) => {
  try {
    const action = await Actions.insert(req.body)
    res.status(201).json(action)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', validateActionId, validateAction, async (req, res, next) => {
  try {
    const updated = await Actions.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', validateActionId, async (req, res, next) => {
  try {
    await Actions.remove(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = router