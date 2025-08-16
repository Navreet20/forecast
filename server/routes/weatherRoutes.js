import express from 'express';
import Weather from '../models/weather.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    // Validate date range
    if (new Date(req.body.dateRange.start) > new Date(req.body.dateRange.end)) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    const weather = new Weather(req.body);
    await weather.save();
    res.status(201).json(weather);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (all)
router.get('/', async (req, res) => {
  try {
    const weathers = await Weather.find();
    res.json(weathers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ (single)
router.get('/:id', async (req, res) => {
  try {
    const weather = await Weather.findById(req.params.id);
    if (!weather) return res.status(404).json({ error: 'Not found' });
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.patch('/:id', async (req, res) => {
  try {
    const weather = await Weather.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!weather) return res.status(404).json({ error: 'Not found' });
    res.json(weather);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const weather = await Weather.findByIdAndDelete(req.params.id);
    if (!weather) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;