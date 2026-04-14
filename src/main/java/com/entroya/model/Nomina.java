package com.entroya.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nominas")
public class Nomina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private Integer mes;

    @Column(nullable = false)
    private Integer ano;

    @Column(nullable = false)
    private String archivoNombre;

    @Column(nullable = false)
    private String archivoUrl = ""; // valor por defecto vacío para no romper constraint

    @Column(nullable = false)
    private String archivoTipo;

    @Column(nullable = false)
    private Integer archivoTamanio;

    @Column(nullable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();

    private String comentarios;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] archivoContenido;

    // Constructores
    public Nomina() {}

    public Nomina(Usuario usuario, Integer mes, Integer ano, String archivoNombre, String archivoUrl, String archivoTipo, Integer archivoTamanio) {
        this.usuario = usuario;
        this.mes = mes;
        this.ano = ano;
        this.archivoNombre = archivoNombre;
        this.archivoUrl = archivoUrl;
        this.archivoTipo = archivoTipo;
        this.archivoTamanio = archivoTamanio;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Integer getMes() { return mes; }
    public void setMes(Integer mes) { this.mes = mes; }

    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }

    public String getArchivoNombre() { return archivoNombre; }
    public void setArchivoNombre(String archivoNombre) { this.archivoNombre = archivoNombre; }

    public String getArchivoUrl() { return archivoUrl; }
    public void setArchivoUrl(String archivoUrl) { this.archivoUrl = archivoUrl; }

    public String getArchivoTipo() { return archivoTipo; }
    public void setArchivoTipo(String archivoTipo) { this.archivoTipo = archivoTipo; }

    public Integer getArchivoTamanio() { return archivoTamanio; }
    public void setArchivoTamanio(Integer archivoTamanio) { this.archivoTamanio = archivoTamanio; }

    public LocalDateTime getFechaSubida() { return fechaSubida; }
    public void setFechaSubida(LocalDateTime fechaSubida) { this.fechaSubida = fechaSubida; }

    public String getComentarios() { return comentarios; }
    public void setComentarios(String comentarios) { this.comentarios = comentarios; }

    public byte[] getArchivoContenido() {
        return archivoContenido;
    }

    public void setArchivoContenido(byte[] archivoContenido) {
        this.archivoContenido = archivoContenido;
    }
}