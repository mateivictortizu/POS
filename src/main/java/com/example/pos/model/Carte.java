package com.example.pos.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table( name = "carte")
public class Carte {
    @Id
    private String ISBN;
    private String titlu;
    private String editura;
    private Integer an_publicare;
    private String gen_literar;

    @ManyToMany(mappedBy = "carti", cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    private Set<Autor> autori = new HashSet<>();

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

    public Integer getAn_publicare(){
        return this.an_publicare;
    }

    public void setAn_publicare(Integer an_editura){
        this.an_publicare =an_editura;
    }

    public String getGen_literar(){
        return this.gen_literar;
    }

    public void setGen_literar(String gen_literar){
        this.gen_literar=gen_literar;
    }

    public Set<Autor> getAutori()
    {
        return this.autori;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Carte))
            return false;
        Carte carte = (Carte) o;
        return Objects.equals(this.ISBN, carte.ISBN) && Objects.equals(this.titlu, carte.titlu)
                && Objects.equals(this.editura, carte.editura) && Objects.equals(this.an_publicare, carte.an_publicare)
                && Objects.equals(this.gen_literar, carte.gen_literar);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.ISBN, this.titlu, this.editura, this.an_publicare, this.gen_literar);
    }

    @Override
    public String toString() {
        return "Carte{" + "ISBN=" + this.ISBN + ", titlu='" + this.titlu + ", editura=" + this.editura +
                ", an publicare=" + this.an_publicare + ", gen literar=" + this.gen_literar +'}';
    }
}
