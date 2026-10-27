package com.careconnect.model;
import jakarta.persistence.*;
@Entity @Table(name="appointments")
public class Appointment {
 @Id @Column(length=50) public String id;
 @Column(nullable=false) public String patientId;
 @Column(nullable=false) public String doctorId;
 public String patientName, doctorName, specialization, date, time;
 @Column(columnDefinition="TEXT") public String reason;
 public String status;
}
