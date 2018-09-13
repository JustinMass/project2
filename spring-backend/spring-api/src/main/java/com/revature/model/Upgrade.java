package com.revature.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "user_upgrades")
public class Upgrade implements Serializable {
	
@Id
@Column(name = "user_id")
private int userId;

@Id
@Column(name = "upgrade")
private String upgrade;


public Upgrade() {
	super();
	// TODO Auto-generated constructor stub
}

public Upgrade(int userId, String upgrade) {
	super();
	this.userId = userId;
	this.upgrade = upgrade;
}
public int getUserId() {
	return userId;
}
public void setUserId(int userId) {
	this.userId = userId;
}
public String getUpgrade() {
	return upgrade;
}
public void setUpgrade(String upgrade) {
	this.upgrade = upgrade;
}
@Override
public int hashCode() {
	final int prime = 31;
	int result = 1;
	result = prime * result + ((upgrade == null) ? 0 : upgrade.hashCode());
	result = prime * result + userId;
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
	Upgrade other = (Upgrade) obj;
	if (upgrade == null) {
		if (other.upgrade != null)
			return false;
	} else if (!upgrade.equals(other.upgrade))
		return false;
	if (userId != other.userId)
		return false;
	return true;
}
@Override
public String toString() {
	return "Upgrade [userId=" + userId + ", upgrade=" + upgrade + "]";
}


}
