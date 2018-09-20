package com.revature.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.dto.Credential;
import com.revature.model.Upgrade;
import com.revature.model.User;
import com.revature.services.UserService;

@CrossOrigin
@RestController
@RequestMapping("users")
public class UserController {

	@Autowired
	private UserService us;

	// /users
	@GetMapping
	public List<User> findAll() {
		System.out.println("finding all users");
		return us.findAll();
	}

	// /users/:id
	@GetMapping("{id}")
	public User findById(@PathVariable int id) {
		User user = us.findOne(id);
		return user;
	}

	// /users/:id
	// this should save over any changes to score or upgrades that are passed in
	// uses id and passes in new user info
	@PatchMapping
	public User update(@RequestBody User u) {
		User user = us.findOne(u.getId());
		if (user != null) {
			return us.update(u);
		}
		return null;
	}

	// create a new user
	@PostMapping
	public User save(@RequestBody User u) {
		// u.setId(1);
		// ResponseEntity<User> re = new ResponseEntity<User>(u, HttpStatus.CREATED);
		return us.save(u);
	}

	// /users/login
	@PostMapping("login")
	public ResponseEntity<User> login(@RequestBody Credential u) {
		User dbUser = us.login(u.getUsername(), u.getPassword());
		if (dbUser != null) {
			return new ResponseEntity<User>(dbUser, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
		}
	}

}
