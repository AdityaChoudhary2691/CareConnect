package com.careconnect.model;

import jakarta.persistence.*;

@Entity @Table(name="users")
public class AppUser {
    @Id @Column(length=50) public String id;
    @Column(nullable=false) public String name;
    @Column(nullable=false, unique=true) public String email;
    @Column(unique=true) public String username;
    @Column(nullable=false) public String password;
    @Column(nullable=false, length=20) public String role;
    @Column(nullable=false) public boolean active=true;
    public String phone;
    public String dob;
    public String gender;
    public String address;
    public String emergency;
    public String bloodGroup;
    @Column(columnDefinition="TEXT") public String medicalHistory;
    public String specialization;
}
