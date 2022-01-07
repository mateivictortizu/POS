package com.example.cartservice.controller;

import com.example.cartservice.model.Cart;
import com.example.cartservice.service.CartService;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CartController {

    @Autowired
    CartService cartService;

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping("/cart")
    ResponseEntity<?> getCart(@RequestParam Integer clientid){

        return new ResponseEntity<>(cartService.getCartOfClient(clientid), HttpStatus.OK);
    }

    //TODO: Handle case when a product is already in, quantity ++
    @PostMapping("/cart")
    ResponseEntity<?> addIteminCart(@RequestBody Cart item)
    {
        return new ResponseEntity<>(cartService.addItem(item), HttpStatus.OK);
    }

    @DeleteMapping("/cart")
    ResponseEntity<?>deleteAllCart(@RequestParam Integer clientid)
    {
        JSONObject message= new JSONObject();
        if(cartService.getCartOfClient(clientid).size()>0) {
            cartService.deleteAllCartOfClient(clientid);
            message.put("message", "Cosul a fost golit");
        }
        else {
            message.put("message","Cosul este deja gol!");
        }
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    // TODO: Delete from cart by bookISBN and clientID
    //@DeleteMapping("/cart")
    //ResponseEntity<?> deleteItemFromCart(@RequestParam Integer clientid, @RequestParam Integer bookISBN){
     //   return null;
    //}
}
