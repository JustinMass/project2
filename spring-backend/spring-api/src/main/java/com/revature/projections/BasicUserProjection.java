package com.revature.projections;

import org.springframework.data.web.ProjectedPayload;

import com.revature.model.AppUser;

public interface BasicUserProjection {
	int getId();

	String getUsername();

	String getRole();

}
