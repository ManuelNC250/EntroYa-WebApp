package com.entroya.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fichajes")
public class Fichajes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegistro tipo;

    public Fichajes() {}

    public Fichajes(Usuario usuario, TipoRegistro tipo) {
        this.usuario = usuario;
        this.tipo = tipo;
        this.fechaHora = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public TipoRegistro getTipo() { return tipo; }
    public void setTipo(TipoRegistro tipo) { this.tipo = tipo; }
}