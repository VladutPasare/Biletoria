package com.example.backend.dto;

import com.example.backend.entity.CompanyAdmin;
import com.example.backend.entity.Email;
import com.example.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private Email.UserType userType;

    public UserResponse(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail().getEmail();
        this.userType = user.getEmail().getUserType();
    }

    public UserResponse(CompanyAdmin companyAdmin) {
        this.id = companyAdmin.getId();
        this.firstName = companyAdmin.getFirstName();
        this.lastName = companyAdmin.getLastName();
        this.email = companyAdmin.getEmail().getEmail();
        this.userType = companyAdmin.getEmail().getUserType();
    }

    public UserResponse (Object user, Email.UserType userType) {
        if(user instanceof User) {
            User u = (User) user;
            this.id = u.getId();
            this.firstName = u.getFirstName();
            this.lastName = u.getLastName();
            this.email = u.getEmail().getEmail();
        } else if (user instanceof CompanyAdmin){
            CompanyAdmin ca = (CompanyAdmin)  user;
            this.id = ca.getId();
            this.firstName = ca.getFirstName();
            this.lastName = ca.getLastName();
            this.email = ca.getEmail().getEmail();
        }
        this.userType = userType;
    }
}
