const bcrypt = require('bcrypt');
const dbQuery = (db, sql, values) => new Promise((resolve, reject) =>
  db.query(sql, values, (err, res) => (err ? reject(err) : resolve(res)))
);

exports.signup = async (req, res) => {
  const db = req.app.get('db');
  const { name, email, password, strengths, weaknesses } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await dbQuery(db, 'INSERT INTO users (name, email, password, strengths, weaknesses) VALUES (?, ?, ?, ?, ?)', [name, email, hashed, strengths, weaknesses]);
  res.sendStatus(201);
};

exports.login = async (req, res) => {
  const db = req.app.get('db');
  const { email, password } = req.body;
  const users = await dbQuery(db, 'SELECT * FROM users WHERE email = ?', [email]);
  const user = users[0];
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).send('Invalid credentials');
  res.json({ ...user, password: undefined });
};

exports.getMatches = async (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;

    console.log(`Fetching matches for user ID: ${id}`);

    const [user] = await dbQuery(db, 'SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
        console.log('User not found');
        return res.status(404).send('User not found');
    }
    console.log('Current User:', { id: user.id, strengths: user.strengths, weaknesses: user.weaknesses });

    const userStrengths = user.strengths ? user.strengths.split(',').map(s => s.trim().toLowerCase()) : [];
    const userWeaknesses = user.weaknesses ? user.weaknesses.split(',').map(w => w.trim().toLowerCase()) : [];

    const allUsers = await dbQuery(db, 'SELECT * FROM users WHERE id != ?', [id]);
    const matches = [];

    allUsers.forEach(match => {
        console.log('Evaluating match:', { id: match.id, name: match.name, strengths: match.strengths, weaknesses: match.weaknesses });

        const matchStrengths = match.strengths ? match.strengths.split(',').map(s => s.trim().toLowerCase()) : [];
        const matchWeaknesses = match.weaknesses ? match.weaknesses.split(',').map(w => w.trim().toLowerCase()) : [];

        const matchedStrengths = matchStrengths.filter(str => userWeaknesses.includes(str));
        const matchedWeaknesses = matchWeaknesses.filter(weak => userStrengths.includes(weak));

        console.log('Matched Strengths:', matchedStrengths);
        console.log('Matched Weaknesses:', matchedWeaknesses);

        if (matchedStrengths.length > 0 && matchedWeaknesses.length > 0) {
            console.log('Match found:', {
                id: match.id,
                name: match.name,
                strengths: matchedStrengths,
                weaknesses: matchedWeaknesses
            });
            matches.push({
                id: match.id,
                name: match.name,
                email: match.email,
                strengths: matchedStrengths,
                weaknesses: matchedWeaknesses
            });
        } else {
            console.log('No mutual benefit found.');
        }
        console.log('---');
    });

    console.log('Final Matches:', matches);
    res.json(matches);
};
