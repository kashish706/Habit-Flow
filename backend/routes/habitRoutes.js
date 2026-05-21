const express = require('express');
const router = express.Router();
const {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  incompleteHabit
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getHabits)
  .post(protect, addHabit);

router.route('/:id')
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

router.post('/:id/complete', protect, completeHabit);
router.post('/:id/incomplete', protect, incompleteHabit);

module.exports = router;