package com.entroya.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.Basic;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "justificantes")
public class Justificante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoJustificante tipo; // Ahora usa el enum externo

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 500)
    private String descripcion;

    private String archivoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoJustificante estado = EstadoJustificante.PENDIENTE; // Enum externo

    private String comentariosAdmin;

    @Column(nullable = false)
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] archivo; // contenido del archivo

    private String archivoNombre;     // nombre original
    private String archivoTipo;       // MIME type

    // Constructores, Getters y Setters...
    public Justificante() {}

    public Justificante(Usuario usuario, TipoJustificante tipo, LocalDate fecha, String descripcion) {
        this.usuario = usuario;
        this.tipo = tipo;
        this.fecha = fecha;
        this.descripcion = descripcion;
    }

    // Getters y Setters para todos los campos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public TipoJustificante getTipo() { return tipo; }
    public void setTipo(TipoJustificante tipo) { this.tipo = tipo; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public EstadoJustificante getEstado() { return estado; }
    public void setEstado(EstadoJustificante estado) { this.estado = estado; }

    public String getComentariosAdmin() { return comentariosAdmin; }
    public void setComentariosAdmin(String comentariosAdmin) { this.comentariosAdmin = comentariosAdmin; }

    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public String getArchivoUrl() { return archivoUrl; }
    public void setArchivoUrl(String archivoUrl) { this.archivoUrl = archivoUrl; }

    public byte[] getArchivo() {
        return archivo;
    }

    public void setArchivo(byte[] archivo) {
        this.archivo = archivo;
    }

    public String getArchivoNombre() {
        return archivoNombre;
    }

    public void setArchivoNombre(String archivoNombre) {
        this.archivoNombre = archivoNombre;
    }

    public String getArchivoTipo() {
        return archivoTipo;
    }

    public void setArchivoTipo(String archivoTipo) {
        this.archivoTipo = archivoTipo;
    }
}