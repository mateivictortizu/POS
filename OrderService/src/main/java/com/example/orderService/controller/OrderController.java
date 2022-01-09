package com.example.orderService.controller;

import com.example.orderService.model.BookOrders;
import com.example.orderService.service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @CrossOrigin(origins = "*")
    @PutMapping("/cancelOrder")
    ResponseEntity<?> cancelOrder(@RequestBody String id, @RequestParam Integer clientid) throws JsonProcessingException {
        JSONObject response=new JSONObject();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(id);
        String idOrder=jsonNode.get("id").asText();
        Boolean book= orderService.cancelOrder(clientid, idOrder);
        if(book)
        {
            response.put("message","Comanda a fost anulata");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else
        {
            response.put("message","Comanda nu a putut fi anulata");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}
