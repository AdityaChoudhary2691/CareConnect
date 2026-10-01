package com.careconnect.controller;

import com.careconnect.model.AppUser;
import com.careconnect.repository.AppUserRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository repo;

    public AuthController(AppUserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String login = body.getOrDefault("login", "").trim();
        String password = body.getOrDefault("password", "");
        String role = body.getOrDefault("role", "");

        Optional<AppUser> found =
                repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(login, login);

        if (found.isEmpty()
                || !found.get().password.equals(password)
                || !found.get().role.equalsIgnoreCase(role)
                || !found.get().active) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid credentials or inactive user"
                    ));
        }

        AppUser u = found.get();

        Map<String, Object> out = new LinkedHashMap<>();

        out.put("id", u.id);
        out.put("name", u.name);
        out.put("email", u.email);
        out.put("username", u.username);
        out.put("role", u.role);
        out.put("active", u.active);
        out.put("phone", u.phone);

        return ResponseEntity.ok(out);
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AppUser p) {

        if (repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(
                p.email, p.email).isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        if (p.username != null
                && repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(
                p.username, p.username).isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already registered"));
        }

        p.id = (p.id == null || p.id.isBlank())
                ? "p-" + System.currentTimeMillis()
                : p.id;

        p.role = "patient";
        p.active = true;

        return ResponseEntity.ok(repo.save(p));
    }


    @GetMapping("/first-admin-available")
    public ResponseEntity<?> firstAdminAvailable() {

        return ResponseEntity.ok(
                Map.of(
                        "available",
                        repo.countByRoleIgnoreCase("admin") == 0
                )
        );
    }


    @PostMapping("/setup-admin")
    public ResponseEntity<?> createFirstAdmin(
            @RequestBody AppUser p) {

        if (repo.countByRoleIgnoreCase("admin") > 0) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "The first-admin setup is already closed. An admin account already exists."
                    ));
        }

        if (p.name == null
                || p.name.isBlank()
                || p.email == null
                || p.email.isBlank()
                || p.username == null
                || p.username.isBlank()
                || p.password == null
                || p.password.length() < 6) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Name, email, username and a password of at least 6 characters are required."
                    ));
        }

        if (repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(
                p.email, p.email).isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Email already registered"
                    ));
        }

        if (repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(
                p.username, p.username).isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Username already registered"
                    ));
        }

        p.id = (p.id == null || p.id.isBlank())
                ? "a-" + System.currentTimeMillis()
                : p.id;

        p.role = "admin";
        p.active = true;

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(repo.save(p));
    }
}