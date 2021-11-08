package com.example.pos.exceptions;

public class CarteNotFoundException extends RuntimeException{
    public CarteNotFoundException(String ISBN)
    {
        super("Could not find book" + ISBN);
    }

    public CarteNotFoundException()
    {
        super("There is no book in this books collection.");
    }
}
