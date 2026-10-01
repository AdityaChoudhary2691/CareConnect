package com.careconnect.model;
import jakarta.persistence.*;
@Entity
@Table(name="test_orders")
public class TestOrder {
 @Id
 @Column(length=50)
 public String id;
 public String patientId, doctorId, patientName, testType, orderDate, priority, status;
 @Column(columnDefinition="TEXT")
 public String remarks;
}
