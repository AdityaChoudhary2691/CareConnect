package com.careconnect.repository;
import com.careconnect.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface AppointmentRepository extends JpaRepository<Appointment,String> {
 List<Appointment> findByPatientId(String patientId); List<Appointment> findByDoctorId(String doctorId);
}
