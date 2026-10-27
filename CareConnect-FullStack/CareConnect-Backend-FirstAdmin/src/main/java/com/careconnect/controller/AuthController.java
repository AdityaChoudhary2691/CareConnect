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

        Optional<AppUser> found = repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(login, login);

        if (found.isEmpty()
                || !found.get().password.equals(password)
                || !found.get().role.equalsIgnoreCase(role)
                || !found.get().active) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials or inactive user"));
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
        if (p.email == null || p.email.isBlank() || p.password == null || p.password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        if (repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(p.email, p.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        if (p.username != null && !p.username.isBlank()
                && repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(p.username, p.username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already registered"));
        }

        p.id = (p.id == null || p.id.isBlank()) ? "p-" + System.currentTimeMillis() : p.id;
        p.role = "patient";
        p.active = true;

        return ResponseEntity.ok(repo.save(p));
    }

    @PostMapping("/setup-admin")
    public ResponseEntity<?> setupAdmin(@RequestBody AppUser admin) {

        // This endpoint is available only until the first admin is created.
        if (repo.countByRoleIgnoreCase("admin") > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Admin account already exists"));
        }

        if (admin.name == null || admin.name.isBlank()
                || admin.email == null || admin.email.isBlank()
                || admin.username == null || admin.username.isBlank()
                || admin.password == null || admin.password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Name, email, username and password are required"));
        }

        if (repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(admin.email, admin.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        if (repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(admin.username, admin.username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already registered"));
        }

        admin.id = "a-" + System.currentTimeMillis();
        admin.role = "admin";
        admin.active = true;

        AppUser saved = repo.save(admin);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", saved.id);
        out.put("name", saved.name);
        out.put("email", saved.email);
        out.put("username", saved.username);
        out.put("role", saved.role);
        out.put("active", saved.active);
        out.put("phone", saved.phone);

        return ResponseEntity.status(HttpStatus.CREATED).body(out);
    }
    @GetMapping("/first-admin-available")
    public ResponseEntity<?> firstAdminAvailable() {

        long adminCount = repo.countByRoleIgnoreCase("admin");

        return ResponseEntity.ok(
                Map.of("available", adminCount == 0)
        );
    }
}
