package com.entroya.dto;

public class AsignarTarjetaRequest {
    private Long usuarioId;
    private String uid;

    // Constructores
    public AsignarTarjetaRequest() {}

    public AsignarTarjetaRequest(Long usuarioId, String uid) {
        this.usuarioId = usuarioId;
        this.uid = uid;
    }

    // Getters y Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }
}