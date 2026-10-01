package com.careconnect.controller;
import com.careconnect.model.Appointment; import com.careconnect.repository.AppointmentRepository; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentRepository r;
    public AppointmentController(AppointmentRepository r){
        this.r=r;
    }
    @GetMapping public List<Appointment> all(){
        return r.findAll();
    }
    @GetMapping("/patient/{id}")
    public List<Appointment> patient(@PathVariable String id){
        return r.findByPatientId(id);
    }
    @GetMapping("/doctor/{id}")
    public List<Appointment> doctor(@PathVariable String id){
        return r.findByDoctorId(id);
    }
    @PostMapping
    public Appointment create(@RequestBody Appointment a){
        if(a.id==null)a.id="apt-"+System.currentTimeMillis();
        if(a.status==null)a.status="Pending";return r.save(a);
    }
    @PutMapping("/{id}")
    public Appointment update(@PathVariable String id,@RequestBody Appointment a){
        a.id=id;return r.save(a);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){
        r.deleteById(id);
    }
}
