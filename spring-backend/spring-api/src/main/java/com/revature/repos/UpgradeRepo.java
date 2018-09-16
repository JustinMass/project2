package com.revature.repos;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revature.model.Upgrade;

@Repository
public interface UpgradeRepo extends JpaRepository<Upgrade, Integer> {

}

