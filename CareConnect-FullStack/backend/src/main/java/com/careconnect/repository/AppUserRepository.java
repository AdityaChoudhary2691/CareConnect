package com.careconnect.repository;
import com.careconnect.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface AppUserRepository extends JpaRepository<AppUser,String> {
 Optional<AppUser> findByEmailIgnoreCaseOrUsernameIgnoreCase(String email,String username); List<AppUser> findByRole(String role); long countByRoleIgnoreCase(String role);
}
