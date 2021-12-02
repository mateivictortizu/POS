package com.example.pos.model;

import org.springframework.hateoas.RepresentationModel;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class Carte extends RepresentationModel<Carte> {
    @Id
    private String ISBN;
    private String titlu;
    private String editura;
    private Integer anpublicare;
    private String genliterar;

    @OneToMany(mappedBy = "autor")
    private Set<CarteAutor> autor = new HashSet<CarteAutor>();

    public Carte() {
    }

    public String getISBN(){
        return this.ISBN;
    }

    public void setISBN(String ISBN){
        this.ISBN=ISBN;
    }

    public String getTitlu(){
        return this.titlu;
    }

    public void setTitlu(String titlu){
        this.titlu=titlu;
    }

    public String getEditura(){
        return this.editura;
    }

    public void setEditura(String editura){
        this.editura=editura;
    }

    public Integer getAnpublicare(){
        return this.anpublicare;
    }

    public void setAnpublicare(Integer an_editura){
        this.anpublicare =an_editura;
    }

    public String getGenliterar(){
        return this.genliterar;
    }

    public void setGenliterar(String gen_literar){
        this.genliterar=gen_literar;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Carte))
            return false;
        Carte carte = (Carte) o;
        return Objects.equals(this.ISBN, carte.ISBN) && Objects.equals(this.titlu, carte.titlu)
                && Objects.equals(this.editura, carte.editura) && Objects.equals(this.anpublicare, carte.anpublicare)
                && Objects.equals(this.genliterar, carte.genliterar);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.ISBN, this.titlu, this.editura, this.anpublicare, this.genliterar);
    }

    @Override
    public String toString() {
        return "Carte{" + "ISBN=" + this.ISBN + ", titlu='" + this.titlu + ", editura=" + this.editura +
                ", an publicare=" + this.anpublicare + ", gen literar=" + this.genliterar +'}';
    }
}
