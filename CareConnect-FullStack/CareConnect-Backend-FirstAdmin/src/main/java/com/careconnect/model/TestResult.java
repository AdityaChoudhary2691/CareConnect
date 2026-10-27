package com.careconnect.model;
import jakarta.persistence.*;
@Entity @Table(name="test_results")
public class TestResult {
 @Id @Column(length=50) public String id;
 public String patientId, doctorId, patientName, testName, testDate, doctor, status;
 @Column(columnDefinition="TEXT") public String result, remarks;
}
