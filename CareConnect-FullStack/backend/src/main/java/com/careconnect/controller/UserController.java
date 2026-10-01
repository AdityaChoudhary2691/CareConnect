package com.careconnect.controller;
import com.careconnect.model.AppUser; import com.careconnect.repository.AppUserRepository; import org.springframework.web.bind.annotation.*; import org.springframework.http.ResponseEntity; import java.util.*;
@RestController @RequestMapping("/api/users")
public class UserController { private final AppUserRepository repo; public UserController(AppUserRepository repo){this.repo=repo;}
 @GetMapping public List<AppUser> all(){return repo.findAll();}
 @PostMapping("/doctors") public ResponseEntity<?> createDoctor(@RequestBody AppUser doctor){
  if(doctor.name==null || doctor.name.isBlank() || doctor.email==null || doctor.email.isBlank() || doctor.password==null || doctor.password.length()<6 || doctor.specialization==null || doctor.specialization.isBlank())
   return ResponseEntity.badRequest().body(Map.of("message","Name, email, password (minimum 6 characters) and specialization are required"));
  if(repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(doctor.email,doctor.email).isPresent())
   return ResponseEntity.status(409).body(Map.of("message","Email already registered"));
  if(doctor.username!=null && !doctor.username.isBlank() && repo.findByEmailIgnoreCaseOrUsernameIgnoreCase(doctor.username,doctor.username).isPresent())
   return ResponseEntity.status(409).body(Map.of("message","Username already registered"));
  doctor.id=(doctor.id==null||doctor.id.isBlank())?"d-"+System.currentTimeMillis():doctor.id;
  doctor.role="doctor"; doctor.active=true;
  return ResponseEntity.status(201).body(repo.save(doctor));
 }
 @GetMapping("/{id}") public AppUser one(@PathVariable String id){return repo.findById(id).orElseThrow();}
 @GetMapping("/role/{role}") public List<AppUser> role(@PathVariable String role){return repo.findByRole(role);}
 @PutMapping("/{id}") public AppUser update(@PathVariable String id,@RequestBody AppUser body){body.id=id;return repo.save(body);}
 @PatchMapping("/{id}/status") public AppUser status(@PathVariable String id,@RequestBody Map<String,Boolean> body){AppUser u=repo.findById(id).orElseThrow();u.active=Boolean.TRUE.equals(body.get("active"));return repo.save(u);}
}
