package com.concretepage.service;

public interface IUserService {

    public String destroyJWT(String token);
    public String validateJWT(String token);
    public String generateJWT(String email, String password);
}
