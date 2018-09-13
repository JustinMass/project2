package com.revature.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "users")
public class User {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "user_id")
private int id;
private String username;
private String password;
private int points;

//@JoinTable(name = "user_upgrades", joinColumns = @JoinColumn(name = "user_id"))
// @Transient
@OneToMany(mappedBy="userId")
private List<Upgrade> upgrades;

public User() {
	super();
	// TODO Auto-generated constructor stub
}

public User(int id, String username, String password, int points, List<Upgrade> upgrades) {
	super();
	this.id = id;
	this.username = username;
	this.password = password;
	this.points = points;
	this.upgrades = upgrades;
}

public int getId() {
	return id;
}

public void setId(int id) {
	this.id = id;
}

public String getUsername() {
	return username;
}

public void setUsername(String username) {
	this.username = username;
}

public String getPassword() {
	return password;
}

public void setPassword(String password) {
	this.password = password;
}

public int getPoints() {
	return points;
}

public void setPoints(int points) {
	this.points = points;
}

public List<Upgrade> getUpgrades() {
	return upgrades;
}

public void setUpgrades(List<Upgrade> upgrades) {
	this.upgrades = upgrades;
}

@Override
public int hashCode() {
	final int prime = 31;
	int result = 1;
	result = prime * result + id;
	result = prime * result + ((password == null) ? 0 : password.hashCode());
	result = prime * result + points;
	result = prime * result + ((upgrades == null) ? 0 : upgrades.hashCode());
	result = prime * result + ((username == null) ? 0 : username.hashCode());
	return result;
}

@Override
public boolean equals(Object obj) {
	if (this == obj)
		return true;
	if (obj == null)
		return false;
	if (getClass() != obj.getClass())
		return false;
	User other = (User) obj;
	if (id != other.id)
		return false;
	if (password == null) {
		if (other.password != null)
			return false;
	} else if (!password.equals(other.password))
		return false;
	if (points != other.points)
		return false;
	if (upgrades == null) {
		if (other.upgrades != null)
			return false;
	} else if (!upgrades.equals(other.upgrades))
		return false;
	if (username == null) {
		if (other.username != null)
			return false;
	} else if (!username.equals(other.username))
		return false;
	return true;
}

@Override
public String toString() {
	return "User [id=" + id + ", username=" + username + ", password=" + password + ", points=" + points + ", upgrades="
			+ upgrades + "]";
}


}
