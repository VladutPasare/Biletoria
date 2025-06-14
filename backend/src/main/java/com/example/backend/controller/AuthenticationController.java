package com.example.backend.controller;

import com.example.backend.dto.CompanyAdminRegistrationRequest;
import com.example.backend.dto.LoginDTO;
import com.example.backend.dto.PassengerRegistrationRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.exception.AuthenticationException;
import com.example.backend.exception.DuplicateEmailException;
import com.example.backend.exception.PasswordMismatchException;
import com.example.backend.service.AuthenticationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/authentication")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody @Valid LoginDTO request, HttpSession session) {
        try {
            UserResponse user = authenticationService.login(request, session);
            return ResponseEntity.ok(user);
        }
        catch (AuthenticationException authenticationException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("error", authenticationException.getMessage()));
        }
    }

    @PostMapping("/register/passenger")
    public ResponseEntity<?> registerPassenger (@RequestBody @Valid PassengerRegistrationRequest request) {
        try {
            UserResponse user = authenticationService.registerPassenger(request);
            return ResponseEntity.ok(user);
        } catch (DuplicateEmailException duplicateEmailException) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Collections.singletonMap("error", duplicateEmailException.getMessage()));
        } catch (PasswordMismatchException passwordMismatchException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", passwordMismatchException.getMessage()));
        }
    }

    @PostMapping("/register/company")
    public ResponseEntity<?> registerCompanyAdmin (@RequestBody @Valid CompanyAdminRegistrationRequest request) {
        try {
            UserResponse user = authenticationService.registerCompanyAdmin(request);
            return ResponseEntity.ok(user);
        }
        catch (DuplicateEmailException duplicateEmailException) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Collections.singletonMap("error", duplicateEmailException.getMessage()));
        }
        catch (PasswordMismatchException passwordMismatchException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", passwordMismatchException.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        authenticationService.logout(session);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(HttpSession session) {
        UserResponse user = authenticationService.getCurrentUser(session);
        return ResponseEntity.ok(user);
    }

    @ExceptionHandler({
            DuplicateEmailException.class,
            PasswordMismatchException.class,
            AuthenticationException.class
    })
    public ResponseEntity<String> handleAuthenticationExceptions(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}

