package com.entroya.dto;

import java.time.LocalTime;

public class HorarioRequest {
    private Long usuarioId;
    private String nombre;
    private LocalTime horaEntrada;
    private LocalTime horaSalida;
    private String diasSemana;

    // Constructores
    public HorarioRequest() {}

    public HorarioRequest(Long usuarioId, String nombre, LocalTime horaEntrada, LocalTime horaSalida, String diasSemana) {
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.diasSemana = diasSemana;
    }

    // Getters y Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public LocalTime getHoraEntrada() { return horaEntrada; }
    public void setHoraEntrada(LocalTime horaEntrada) { this.horaEntrada = horaEntrada; }

    public LocalTime getHoraSalida() { return horaSalida; }
    public void setHoraSalida(LocalTime horaSalida) { this.horaSalida = horaSalida; }

    public String getDiasSemana() { return diasSemana; }
    public void setDiasSemana(String diasSemana) { this.diasSemana = diasSemana; }
}