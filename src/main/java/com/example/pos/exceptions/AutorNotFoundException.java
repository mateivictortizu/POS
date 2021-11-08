package com.example.pos.exceptions;

public class AutorNotFoundException extends RuntimeException{
    public AutorNotFoundException(Integer ID)
    {
        super("Could not find autor" + ID);
    }

    public AutorNotFoundException()
    {
        super("No author in this books collection");
    }
}
