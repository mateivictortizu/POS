package com.example.pos.model;

import net.minidev.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.ElementCollection;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Embeddable
class Order{
    String ISBN = null;
    String title = null;
    Integer price = null;
    Integer quantity = null;


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
}

@Document(collection = "#{@configRepositoryCustom.getCollectionName()}")
public class BookOrders implements Serializable {
    private Date date;
    private String status;

    @Embedded
    private List<Order> items;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setItems(List<Order> items) {
        this.items = items;
    }

    public List<Order> getItems() {
        return items;
    }

    @Override
    public String toString() {
        return "BookOrders{ status=" + this.status + ", date=" + this.date + "}";
    }
}
