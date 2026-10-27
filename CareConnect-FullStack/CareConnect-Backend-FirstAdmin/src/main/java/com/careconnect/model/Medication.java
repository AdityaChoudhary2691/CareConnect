package com.careconnect.model;
import jakarta.persistence.*;
@Embeddable public class Medication {
 public String name, dosage, frequency, duration;
 @Column(columnDefinition="TEXT") public String instructions, precautions;
}
