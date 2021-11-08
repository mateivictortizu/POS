package com.example.pos.advice;

import com.example.pos.exceptions.CarteNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
class CarteNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(CarteNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String carteNotFoundHandler(CarteNotFoundException ex) {
        return ex.getMessage();
    }
}
