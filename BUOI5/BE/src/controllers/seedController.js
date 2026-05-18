const seedDatabase = require('../seeds/seedData');

const seedController = {
  seedData: async (req, res) => {
    try {
      const result = await seedDatabase();
      if (result) {
        res.json({ success: true, message: 'Database seeded successfully!' });
      } else {
        res.status(500).json({ success: false, message: 'Failed to seed database' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = seedController;
