package com.careconnect.controller;
import com.careconnect.model.AppUser; import com.careconnect.repository.AppUserRepository; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/users")
public class UserController { private final AppUserRepository repo; public UserController(AppUserRepository repo){this.repo=repo;}
 @GetMapping public List<AppUser> all(){return repo.findAll();}
 @GetMapping("/{id}") public AppUser one(@PathVariable String id){return repo.findById(id).orElseThrow();}
 @GetMapping("/role/{role}") public List<AppUser> role(@PathVariable String role){return repo.findByRole(role);}
 @PutMapping("/{id}") public AppUser update(@PathVariable String id,@RequestBody AppUser body){body.id=id;return repo.save(body);}
 @PatchMapping("/{id}/status") public AppUser status(@PathVariable String id,@RequestBody Map<String,Boolean> body){AppUser u=repo.findById(id).orElseThrow();u.active=Boolean.TRUE.equals(body.get("active"));return repo.save(u);}
}
