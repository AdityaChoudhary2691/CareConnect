package com.careconnect.controller;
import com.careconnect.model.TestOrder; import com.careconnect.repository.TestOrderRepository; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController
@RequestMapping("/api/test-orders")
public class TestOrderController {
    private final TestOrderRepository r;
    public TestOrderController(TestOrderRepository r){
        this.r=r;
    }
    @GetMapping
    public List<TestOrder> all(){
        return r.findAll();
    }
    @GetMapping("/patient/{id}")
    public List<TestOrder> patient(@PathVariable String id){
        return r.findByPatientId(id);
    }
    @PostMapping
    public TestOrder create(@RequestBody TestOrder x){
        if(x.id==null) x.id="ord-"+System.currentTimeMillis();
        if(x.status==null)x.status="Ordered";
        return r.save(x);
    }
    @PutMapping("/{id}")
    public TestOrder update(@PathVariable String id,@RequestBody TestOrder x){
        x.id=id;return r.save(x);
    }
}
