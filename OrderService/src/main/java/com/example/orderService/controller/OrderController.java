package com.example.orderService.controller;

import com.example.orderService.model.BookOrders;
import com.example.orderService.service.OrderService;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class OrderController {

    @Autowired
    OrderService orderService;

    @GetMapping("/orders")
    ResponseEntity<?> getBookOrder(@RequestParam Integer client_id)
    {   List<BookOrders> books= orderService.getBookOrder(client_id);
        return new ResponseEntity<>(books,HttpStatus.OK);
    }

    @PostMapping("/orders")
    ResponseEntity<?> addBookOrder(@RequestBody BookOrders bookOrders, @RequestParam Integer client_id) {
        JSONObject response=new JSONObject();
        Boolean check= orderService.addBookOrder(bookOrders, client_id);
        if(check)
        {
            response.put("message","Comanda a reusit");
        }
        else
        {
            response.put("message","Unul dintre produse nu mai este in stoc");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
