package com.careconnect.model;
import jakarta.persistence.*;
@Entity
@Table(name="medical_records")
public class MedicalRecord {
 @Id
 @Column(length=50)
 public String id;
 public String patientId, doctorId, doctorName, date;
 @Column(columnDefinition="TEXT")
 public String symptoms, diagnosis, observations, clinicalNotes, treatmentPlan, suggestions, precautions, followUp;
}
