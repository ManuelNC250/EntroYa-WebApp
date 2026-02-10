package com.entroya.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tarjetas_nfc")
public class TarjetaNfc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(unique = true, nullable = false)
    private String uid;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(nullable = false)
    private LocalDateTime fechaAsignacion = LocalDateTime.now();

    // Constructores
    public TarjetaNfc() {}

    public TarjetaNfc(Usuario usuario, String uid) {
        this.usuario = usuario;
        this.uid = uid;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }

    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }

    public LocalDateTime getFechaAsignacion() { return fechaAsignacion; }
    public void setFechaAsignacion(LocalDateTime fechaAsignacion) { this.fechaAsignacion = fechaAsignacion; }
}