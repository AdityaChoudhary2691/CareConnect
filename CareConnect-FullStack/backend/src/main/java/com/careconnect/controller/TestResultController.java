package com.careconnect.controller;
import com.careconnect.model.TestResult; import com.careconnect.repository.TestResultRepository; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController
@RequestMapping("/api/test-results")
public class TestResultController {
    private final TestResultRepository r;
    public TestResultController(TestResultRepository r){
        this.r=r;
    }
    @GetMapping
    public List<TestResult> all(){
        return r.findAll();
    }
    @GetMapping("/patient/{id}")
    public List<TestResult> patient(@PathVariable String id){
        return r.findByPatientId(id);
    }
    @PostMapping
    public TestResult create(@RequestBody TestResult x){
        if(x.id==null) x.id="res-"+System.currentTimeMillis();
        return r.save(x);
    }
    @PutMapping("/{id}")
    public TestResult update(@PathVariable String id,@RequestBody TestResult x){
        x.id=id;return r.save(x);
    }
}
