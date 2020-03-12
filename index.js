// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db');

server.use(express.json());

server.post('/api/users', (req, res) => {
	const newUser = req.body;
	if (typeof newUser.name === 'undefined' || typeof newUser.bio === 'undefined') {
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
		db.insert(newUser)
			.then(addedUser => {
				res.status(201).json(addedUser);
			})
			.catch(err => {
				res.status(500).json({
					errorMessage: 'There was an error while saving the user to the database'
				});
			});
	}
});

server.get('/api/users', (req, res) => {
	db.find()
		.then(users => {
			res.status(200).json(users);
		})
		.catch(err => {
			res
				.status(500)
				.json({ errorMessage: 'The users information could not be retrieved.' });
		});
});

server.get('/api/users/:id', (req, res) => {
	db.findById(req.params.id)
		.then(user => {
			if (user) {
				res.status(200).json(user);
			} else {
				res
					.status(404)
					.json({ message: 'The user with the specified ID does not exist.' });
			}
		})
		.catch(err => {
			res
				.status(500)
				.json({ errorMessage: 'The user information could not be retrieved.' });
		});
});

server.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;
	db.remove(id)
		.then(deletedUser => {
			if (deletedUser) {
				res.status(204).end();
			} else {
				res
					.status(404)
					.json({ message: 'The user with the specified ID does not exist.' });
			}
		})
		.catch(err => {
			res.status(500).json({ errorMessage: 'The user could not be removed' });
		});
});

server.put('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const editUser = req.body;
	if (typeof editUser.name === 'undefined' || typeof editUser.bio === 'undefined') {
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
		db.update(id, editUser)
			.then(updatedUser => {
				if (updatedUser) {
					res.status(200).json(updatedUser);
				} else {
					res
						.status(404)
						.json({ message: 'The user with the specified ID does not exist.' });
				}
			})
			.catch(err => {
				res
					.status(500)
					.json({ errorMessage: 'The user information could not be modified.' });
			});
	}
});

server.listen(5000, () => console.log('Server running on port 5000'));
