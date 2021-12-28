package com.concretepage.entity;
import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="wishlist")
public class Wishlist implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "wishlist_id")
    private Integer wishlistID;
    @Column(name = "client_id")
    private Integer clientId;
    @Column(name = "book_isbn")
    private String bookISBN;
    @Column(name="titlu")
    private String titlu;
    @Column(name="price")
    private Integer price;

    public Integer getWishlistID() {
        return wishlistID;
    }

    public void setWishlistID(Integer wishlistID) {
        this.wishlistID = wishlistID;
    }

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getBookISBN() {
        return bookISBN;
    }

    public void setBookISBN(String bookISBN) {
        this.bookISBN = bookISBN;
    }

    public String getTitlu(){return titlu;}

    public void setTitlu(String titlu) {
        this.titlu = titlu;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}
