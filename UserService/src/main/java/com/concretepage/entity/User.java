package com.concretepage.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="user")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id")
    private Integer userID;
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name="role")
    private String role;

    public Integer getUserID() {
        return userID;
    }

    public void setUserID(Integer wishlistID) {
        this.userID = wishlistID;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole(){return role;}

    public void setRole(String role) {
        this.role = role;
    }

}
