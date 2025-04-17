package com.kakzumooto.speedword.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nombreUsuario;

    @Column(nullable = false)
    private String password;

    private Double recordSegundos;

    private LocalDateTime fechaRecord;

    public Long getId() {
        return id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public String getPassword() {
        return password;
    }

    public Double getRecordSegundos() {
        return recordSegundos;
    }

    public LocalDateTime getFechaRecord() {
        return fechaRecord;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRecordSegundos(Double recordSegundos) {
        this.recordSegundos = recordSegundos;
    }

    public void setFechaRecord(LocalDateTime fechaRecord) {
        this.fechaRecord = fechaRecord;
    }
}
