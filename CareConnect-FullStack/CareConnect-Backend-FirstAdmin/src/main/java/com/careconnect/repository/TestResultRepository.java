package com.careconnect.repository;
import com.careconnect.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface TestResultRepository extends JpaRepository<TestResult,String> {
 List<TestResult> findByPatientId(String patientId);
}
