package com.careconnect.repository;
import com.careconnect.model.TestOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface TestOrderRepository extends JpaRepository<TestOrder,String> {
 List<TestOrder> findByPatientId(String patientId);
}
