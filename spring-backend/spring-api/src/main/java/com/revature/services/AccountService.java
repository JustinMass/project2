package com.revature.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.model.Account;
import com.revature.repos.AccountRepo;

@Service
public class AccountService {

	@Autowired
	private AccountRepo accountRepo;

	public int save(Account a) {
		return accountRepo.saveAndFlush(a).getAccountNumber();
	}

	public List<Account> findAll() {
		return accountRepo.findAll();
	}

}
