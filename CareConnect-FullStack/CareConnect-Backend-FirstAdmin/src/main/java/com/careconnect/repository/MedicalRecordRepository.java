package com.careconnect.repository;
import com.careconnect.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord,String> {
 List<MedicalRecord> findByPatientId(String patientId); List<MedicalRecord> findByDoctorId(String doctorId);
}
