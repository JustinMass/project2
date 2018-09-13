package com.revature.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.model.User;
import com.revature.repos.UserRepo;

@Service
public class UserService {

	@Autowired
	private UserRepo ur;

	public List<User> findAll() {
		return ur.findAll();
	}
	//@Transactional
	public User findOne(int id) {
		User u = ur.findById(id).get();
		//u.setPoints(u.getPoints() + 10);
		return u;
	}

	public User login(String username, String password) {
		return ur.findByUsernameAndPassword(username, password);
	}

}
