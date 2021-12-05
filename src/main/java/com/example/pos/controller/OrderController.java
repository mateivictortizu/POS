package com.example.pos.controller;

import com.example.pos.model.BookOrders;
import com.example.pos.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrderController {

    @Autowired
    OrderService orderService;

    @GetMapping("/test")
    ResponseEntity<?> getname(@RequestParam String name)
    {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/test")
    ResponseEntity<?> addBookOrder(@RequestBody BookOrders bookOrders, @RequestParam Integer client_id)
    {
        orderService.addBookOrder(bookOrders,client_id);
        return new ResponseEntity<>(bookOrders, HttpStatus.OK);
    }
}
