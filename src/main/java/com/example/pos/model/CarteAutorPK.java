package com.example.pos.model;

import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class CarteAutorPK extends RepresentationModel<CarteAutorPK> implements Serializable {

    @Column(name = "AUTOR_ID")
    private Integer autor_id;

    @Column(name = "CARTE_ISBN")
    private String carte_isbn;

    public CarteAutorPK() {

    }

    public void setAutor_id(Integer autor_id) {
        this.autor_id = autor_id;
    }

    public void setCarte_isbn(String carte_isbn) {
        this.carte_isbn = carte_isbn;
    }
}
