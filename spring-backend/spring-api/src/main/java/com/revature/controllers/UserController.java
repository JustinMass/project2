package com.revature.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.dto.Credential;
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

	@PostMapping
	public ResponseEntity<User> save(@RequestBody User u) {
		ResponseEntity<User> re = new ResponseEntity<User>(u, HttpStatus.CREATED);
		return re;
	}

	@PostMapping("login")
	public User login(@RequestBody Credential u) {
		return us.login(u.getUsername(), u.getPassword());
	}


}
