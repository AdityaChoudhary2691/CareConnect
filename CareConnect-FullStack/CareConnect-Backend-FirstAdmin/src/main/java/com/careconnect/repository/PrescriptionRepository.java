package com.careconnect.repository;
import com.careconnect.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface PrescriptionRepository extends JpaRepository<Prescription,String> {
 List<Prescription> findByPatientId(String patientId);
}
