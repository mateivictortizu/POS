package com.example.pos.model;

import org.springframework.hateoas.RepresentationModel;
import javax.persistence.*;
import java.io.Serializable;

@Entity
public class CarteAutor extends RepresentationModel<CarteAutor> implements Serializable {

    public CarteAutor(){
    }

    @EmbeddedId
    private CarteAutorPK id;

    @ManyToOne
    @MapsId("autor_id") //This is the name of attr in EmployerDeliveryAgentPK class
    @JoinColumn(name = "AUTOR_ID")
    private Autor autor;

    @ManyToOne
    @MapsId("carte_isbn")
    @JoinColumn(name = "CARTE_ISBN")
    private Carte carte;

    @Column(name="index_autor")
    private Integer index_autor;

    public void setAutor(Autor autor) {
        this.autor = autor;
    }

    public void setCarte(Carte carte) {
        this.carte = carte;
    }

    public Autor getAutor() {
        return autor;
    }

    public Carte getCarte() {
        return carte;
    }

    public void setId(Integer id, String ISBN) {
        CarteAutorPK pk=new CarteAutorPK();
        pk.setAutor_id(id);
        pk.setCarte_isbn(ISBN);
        this.id=pk;
    }

    public void setIndex_autor(Integer index_autor) {
        this.index_autor = index_autor;
    }
}
