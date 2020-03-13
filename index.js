// implement your API here
const express = require('express'); // Require express to use
const server = express(); // Save express() to const
const db = require('./data/db'); // To use db functions

// To send json data
server.use(express.json());

// Post Request
server.post('/api/users', (req, res) => {
	const newUser = req.body; // Pass request to const
	// Check to see if request has a name and bio
	if (typeof newUser.name === 'undefined' || typeof newUser.bio === 'undefined') {
		// 400 = Bad Request
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
		// Run insert function, passing newUser as prop
		db.insert(newUser)
			.then(addedUser => {
				res.status(201).json(addedUser); // 201 = created, return added object
			})
			.catch(err => {
				// 500 = internal server error
				res.status(500).json({
					errorMessage: 'There was an error while saving the user to the database'
				});
			});
	}
});

// Get Request
server.get('/api/users', (req, res) => {
	// Run find function
	db.find()
		.then(users => {
			res.status(200).json(users); // 200 = Ok, return result
		})
		.catch(err => {
			// 500 = internal server error
			res
				.status(500)
				.json({ errorMessage: 'The users information could not be retrieved.' });
		});
});

// Get Request, Specific ID
server.get('/api/users/:id', (req, res) => {
	// Run findbyId function, pass id as prop
	db.findById(req.params.id)
		.then(user => {
			// Check to see if user with that ID exists
			if (user) {
				res.status(200).json(user); // 200 = Ok, return result
			} else {
				// 404 = Not found
				res
					.status(404)
					.json({ message: 'The user with the specified ID does not exist.' });
			}
		})
		.catch(err => {
			// 500 = internal server error
			res
				.status(500)
				.json({ errorMessage: 'The user information could not be retrieved.' });
		});
});

// Delete Request, Specific ID
server.delete('/api/users/:id', (req, res) => {
	const { id } = req.params; // Save ID to const
	// Run remove function, pass id as prop
	db.remove(id)
		.then(deletedUser => {
			// Check to see if user with that ID exists
			if (deletedUser) {
				res.status(204).end(); // 204 = No Content, fulfilled request
			} else {
				// 404 = Not found
				res
					.status(404)
					.json({ message: 'The user with the specified ID does not exist.' });
			}
		})
		.catch(err => {
			// 500 = internal server error
			res.status(500).json({ errorMessage: 'The user could not be removed' });
		});
});

// Put Request, Specific ID
server.put('/api/users/:id', (req, res) => {
	const { id } = req.params; // Save ID to const
	const editUser = req.body; // Save request body to const
	// Check to see if request has a name and bio
	if (typeof editUser.name === 'undefined' || typeof editUser.bio === 'undefined') {
		// 400 = Bad Request
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
		// Run update function, pass id and editUser as props
		db.update(id, editUser)
			.then(updatedUser => {
				// Check to see if user with that ID exists
				if (updatedUser) {
					res.status(200).json(updatedUser); // 200 = Ok, return updatedUser
				} else {
					// 404 = Not found
					res
						.status(404)
						.json({ message: 'The user with the specified ID does not exist.' });
				}
			})
			.catch(err => {
				// 500 = internal server error
				res
					.status(500)
					.json({ errorMessage: 'The user information could not be modified.' });
			});
	}
});

// Choose port to listen to, followed by console.log
server.listen(5000, () => console.log('Server running on port 5000'));
