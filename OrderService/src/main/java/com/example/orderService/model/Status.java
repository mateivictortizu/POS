package com.example.orderService.model;

import javax.persistence.Embeddable;

@Embeddable
public enum Status {
    FINALIZATA,
    ACTIVA,
    ANULATA
}
