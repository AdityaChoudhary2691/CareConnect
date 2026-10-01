package com.careconnect.model;
import jakarta.persistence.*; import java.util.*;
@Entity
@Table(name="prescriptions")
public class Prescription {
 @Id
 @Column(length=50)
 public String id;
 public String patientId, doctorId, doctorName, date;
 @ElementCollection(fetch=FetchType.EAGER)
 @CollectionTable(name="prescription_medicines", joinColumns=@JoinColumn(name="prescription_id"))
 public List<Medication> medicines = new ArrayList<>();
}
