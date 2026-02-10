package com.entroya.dto;

public class NominaRequest {
    private Long usuarioId;
    private Integer mes;
    private Integer ano;
    private String archivoNombre;
    private String archivoUrl;
    private String archivoTipo;
    private Integer archivoTamanio;
    private String comentarios;

    // Constructores
    public NominaRequest() {}

    public NominaRequest(Long usuarioId, Integer mes, Integer ano, String archivoNombre, String archivoUrl, String archivoTipo, Integer archivoTamanio) {
        this.usuarioId = usuarioId;
        this.mes = mes;
        this.ano = ano;
        this.archivoNombre = archivoNombre;
        this.archivoUrl = archivoUrl;
        this.archivoTipo = archivoTipo;
        this.archivoTamanio = archivoTamanio;
    }

    // Getters y Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

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

    public String getComentarios() { return comentarios; }
    public void setComentarios(String comentarios) { this.comentarios = comentarios; }
}