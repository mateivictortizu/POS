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

    @CrossOrigin(origins = "*")
    @GetMapping("/orders")
    ResponseEntity<?> getBookOrder(@RequestParam Integer clientid)
    {   List<BookOrders> books= orderService.getBookOrder(clientid);
        return new ResponseEntity<>(books,HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/orders")
    ResponseEntity<?> addBookOrder(@RequestBody BookOrders bookOrders, @RequestParam Integer clientid) {
        JSONObject response=new JSONObject();
        Boolean check= orderService.addBookOrder(bookOrders, clientid);
        if(check)
        {
            response.put("message","Comanda a reusit");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else
        {
            response.put("message","Unul dintre produse nu mai este in stoc");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
