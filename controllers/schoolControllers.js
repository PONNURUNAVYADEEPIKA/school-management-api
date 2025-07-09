const db = require('../db');

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'School added successfully' });
  });
};

exports.listSchools = (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLng = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ error: 'Invalid user coordinates' });
  }

  db.query('SELECT * FROM schools', (err, schools) => {
    if (err) return res.status(500).json({ error: err.message });

    const sortedSchools = schools.map(school => {
      const dist = Math.sqrt(
        Math.pow(userLat - school.latitude, 2) +
        Math.pow(userLng - school.longitude, 2)
      );
      return { ...school, distance: dist };
    }).sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  });
};
