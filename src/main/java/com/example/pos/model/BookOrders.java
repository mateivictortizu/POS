package com.example.pos.model;

import net.minidev.json.JSONObject;
import netscape.javascript.JSObject;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Document(collection = "#{@configRepositoryCustom.getCollectionName()}")
public class BookOrders implements Serializable {
    private Date date;
    private String status;

    private List<JSONObject> items;

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

    public void setItems(List<JSONObject> items) {
        this.items = items;
    }

    public List<JSONObject> getItems() {
        return items;
    }

    @Override
    public String toString() {
        return "BookOrders{ status=" + this.status + ", date=" + this.date + "}";
    }
}
