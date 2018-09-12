package com.revature.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.model.Movie;
import com.revature.repos.MovieRepo;
import com.revature.repos.UserRepo;

@Service
public class MovieService {

	@Autowired
	private UserRepo ur;

	@Autowired
	private MovieRepo movieRepo;

	public int save(Movie m) {
		return movieRepo.saveAndFlush(m).getId();
	}

	public List<Movie> findAll() {
		return movieRepo.findAll();
	}

}
