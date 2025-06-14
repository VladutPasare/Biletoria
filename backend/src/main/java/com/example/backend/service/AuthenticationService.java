package com.example.backend.service;

import com.example.backend.dto.CompanyAdminRegistrationRequest;
import com.example.backend.dto.LoginDTO;
import com.example.backend.dto.PassengerRegistrationRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.entity.CompanyAdmin;
import com.example.backend.entity.Email;
import com.example.backend.entity.User;
import com.example.backend.exception.AuthenticationException;
import com.example.backend.exception.DuplicateEmailException;
import com.example.backend.exception.PasswordMismatchException;
import com.example.backend.repository.CompanyAdminRepository;
import com.example.backend.repository.EmailRepository;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final CompanyAdminRepository companyAdminRepository;
    private final EmailRepository emailRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse registerPassenger(PassengerRegistrationRequest request) {
        if(emailRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use!");
        }

        if(!request.getPassword().equals(request.getConfirmationPassword())) {
            throw new PasswordMismatchException("Passwords don't match");
        }

        Email email = new Email();
        email.setEmail(request.getEmail());
        email.setUserType(Email.UserType.PASSENGER);
        Email savedEmail = emailRepository.save(email);

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(savedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }

    @Transactional
    public UserResponse registerCompanyAdmin(CompanyAdminRegistrationRequest request) {
        if(emailRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use!");
        }

        if(!request.getPassword().equals(request.getConfirmationPassword())) {
            throw new PasswordMismatchException("Passwords don't match");
        }

        Email email = new Email();
        email.setEmail(request.getEmail());
        email.setUserType(Email.UserType.COMPANY_ADMIN);
        Email savedEmail = emailRepository.save(email);

        CompanyAdmin companyAdmin = new CompanyAdmin();
        companyAdmin.setFirstName(request.getFirstName());
        companyAdmin.setLastName(request.getLastName());
        companyAdmin.setEmail(savedEmail);
        companyAdmin.setPassword(passwordEncoder.encode((request.getPassword())));
        companyAdmin.setCompanyName(request.getCompanyName());
        companyAdmin.setCompanyPhone(request.getCompanyPhone());
        companyAdmin.setCompanyAddress(request.getCompanyAddress());
        companyAdmin.setApproved(false);

        CompanyAdmin savedAdmin = companyAdminRepository.save(companyAdmin);
        return new UserResponse(savedAdmin);
    }

    public UserResponse login(LoginDTO request, HttpSession session) {
        Email email = emailRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid credentials"));
        Object user;

        if(email.getUserType() == Email.UserType.PASSENGER) {
            user = userRepository.findByEmail_Email(request.getEmail())
                    .orElseThrow(() -> new AuthenticationException("Invalid credentials"));

            if (!passwordEncoder.matches(request.getPassword(), ((User) user).getPassword())) {
                throw new AuthenticationException("Invalid credentials");
            }

            if(!((User) user).isActive()) {
                throw new AuthenticationException("Account is not active");
            }
        } else if(email.getUserType() == Email.UserType.COMPANY_ADMIN) {
            user = companyAdminRepository.findByEmail_Email(request.getEmail())
                    .orElseThrow(() -> new AuthenticationException("Invalid credentials"));

            if(!passwordEncoder.matches(request.getPassword(), ((CompanyAdmin) user).getPassword())) {
                throw new AuthenticationException("Invalid credentials");
            }

            if(!((CompanyAdmin) user).isApproved()) {
                throw new AuthenticationException("Company admin account not yet approved");
            }
        } else {

        }

        UserResponse userResponse = new UserResponse(user, email.getUserType());
        session.setAttribute("user", userResponse);
        return userResponse;
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }

    public UserResponse getCurrentUser(HttpSession session) {
        UserResponse user = (UserResponse) session.getAttribute("user");

        if(user == null) {
            throw new AuthenticationException("Not authenticated");
        }
        return user;
    }
}
