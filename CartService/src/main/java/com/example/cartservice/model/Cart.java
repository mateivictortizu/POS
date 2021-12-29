package com.example.cartservice.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer ID;
    private Integer clientid;
    private String ISBN;
    private String title;
    private Integer price = null;
    private Integer quantity = null;

    public Cart(){

    }

    public Cart(Integer id, Integer clientid, String isbn, String title, Integer price, Integer quantity)
    {
        this.ID=id;
        this.clientid=clientid;
        this.ISBN=isbn;
        this.title=title;
        this.price=price;
        this.quantity=quantity;
    }

    public Integer getID() {
        return this.ID;
    }

    public void setID(Integer ID) {
        this.ID = ID;
    }

    public void setISBN(String ISBN) {
        this.ISBN = ISBN;
    }

    public String getISBN() {
        return ISBN;
    }

    public Integer getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public String getTitle() {
        return title;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getClientid() {
        return clientid;
    }

    public void setClientid(Integer clientid) {
        this.clientid = clientid;
    }
}
