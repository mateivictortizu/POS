package com.example.pos.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class Autor {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer ID;
    private String prenume;
    private String nume;

    @OneToMany(mappedBy = "carte")
    private final Set<CarteAutor> carti = new HashSet<CarteAutor>();

    public Autor() {
    }

    public Autor(Integer id, String prenume, String nume) {
        this.ID = id;
        this.nume = nume;
        this.prenume=prenume;
    }

    public Integer getID() {
        return this.ID;
    }

    public void setID(Integer ID) {
        this.ID = ID;
    }

    public String getPrenume() {
        return this.prenume;
    }

    public void setPrenume(String prenume) {
        this.prenume = prenume;
    }

    public String getNume() {
        return this.nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Autor))
            return false;
        Autor autor = (Autor) o;
        return Objects.equals(this.ID, autor.ID) && Objects.equals(this.prenume, autor.prenume)
                && Objects.equals(this.nume, autor.nume);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.ID, this.prenume, this.nume);
    }

    @Override
    public String toString() {
        return "Autor{" + "ID=" + this.ID + ", prenume='" + this.prenume + ", nume=" + this.nume + '}';
    }
}
