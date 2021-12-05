package com.example.pos.model;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.io.Serializable;
import java.util.Date;
import java.util.Map;

@Document(collection = "#{@configRepositoryCustom.getCollectionName()}")
public class BookOrders implements Serializable {
    private Date date;
    private String status;

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

    @Override
    public String toString() {
        return "BookOrders{ status=" + this.status + ", date=" + this.date + "}";
    }
}
