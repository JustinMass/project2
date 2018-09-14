package com.revature.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.model.Upgrade;
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
		return u;
	}
	
	public int save (User u) {
		return ur.saveAndFlush(u).getId();
	}

	public User login(String username, String password) {
		return ur.findByUsernameAndPassword(username, password);
	}

	@Transactional
	public User update(User u) {
		ur.saveAndFlush(u);
		return u;
	}

}
