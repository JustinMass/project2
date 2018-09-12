package com.revature.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revature.model.Movie;

@Repository
public interface MovieRepo extends JpaRepository<Movie, Integer> {

}
