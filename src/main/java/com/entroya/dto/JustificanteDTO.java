package com.entroya.dto;

import com.entroya.model.EstadoJustificante;
import com.entroya.model.TipoJustificante;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class JustificanteDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private TipoJustificante tipo;
    private LocalDate fecha;
    private String descripcion;
    private EstadoJustificante estado;
    private String comentariosAdmin;
    private LocalDateTime fechaSolicitud;
    private String archivoNombre;
    private String archivoTipo;
    private boolean tieneArchivo;

    // Constructor vacío
    public JustificanteDTO() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

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

    public String getArchivoNombre() { return archivoNombre; }
    public void setArchivoNombre(String archivoNombre) { this.archivoNombre = archivoNombre; }

    public String getArchivoTipo() { return archivoTipo; }
    public void setArchivoTipo(String archivoTipo) { this.archivoTipo = archivoTipo; }

    public boolean isTieneArchivo() { return tieneArchivo; }
    public void setTieneArchivo(boolean tieneArchivo) { this.tieneArchivo = tieneArchivo; }
}