package com.entroya.controller;

import com.entroya.model.Fichajes;
import com.entroya.model.Usuario;
import com.entroya.repository.FichajeRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trabajador")
@CrossOrigin(origins = "*")
public class TrabajadorController {

    @Autowired
    private FichajeRepository fichajeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/historial/{usuarioId}")
    public Map<String, Object> getHistorialHoy(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
            LocalDateTime finDia = LocalDate.now().atTime(23, 59, 59);

            List<Fichajes> registrosHoy = fichajeRepository.findByUsuarioAndFechaHoraBetween(usuario, inicioDia, finDia);

            response.put("status", "success");
            response.put("usuario", usuario.getNombre());
            response.put("registrosHoy", registrosHoy);
            response.put("totalRegistrosHoy", registrosHoy.size());

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    // Nuevo endpoint: historial completo
    @GetMapping("/historial/completo/{usuarioId}")
    public Map<String, Object> getHistorialCompleto(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<Fichajes> todosFichajes = fichajeRepository.findByUsuarioOrderByFechaHoraDesc(usuario);

            response.put("status", "success");
            response.put("usuario", usuario.getNombre());
            response.put("registros", todosFichajes);
            response.put("totalRegistros", todosFichajes.size());

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    @GetMapping("/resumen/{usuarioId}")
    public Map<String, Object> getResumenSemanal(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Obtener inicio y fin de la semana actual (lunes a domingo)
            LocalDate hoy = LocalDate.now();
            LocalDate inicioSemana = hoy.with(java.time.DayOfWeek.MONDAY);
            LocalDate finSemana = hoy.with(java.time.DayOfWeek.SUNDAY);

            LocalDateTime inicio = inicioSemana.atStartOfDay();
            LocalDateTime fin = finSemana.atTime(23, 59, 59);

            // Obtener fichajes de esta semana
            List<Fichajes> fichajesSemana = fichajeRepository
                    .findByUsuarioIdAndFechaHoraBetweenOrderByFechaHoraAsc(usuarioId, inicio, fin);

            // Calcular horas trabajadas por dia
            Map<LocalDate, List<Fichajes>> porDia = new java.util.LinkedHashMap<>();
            for (Fichajes f : fichajesSemana) {
                LocalDate fecha = f.getFechaHora().toLocalDate();
                porDia.computeIfAbsent(fecha, k -> new java.util.ArrayList<>()).add(f);
            }

            long totalMinutos = 0;
            int diasTrabajados = 0;

            for (Map.Entry<LocalDate, List<Fichajes>> entry : porDia.entrySet()) {
                List<Fichajes> del_dia = entry.getValue();
                // Calcular tiempo trabajado: sumar pares ENTRADA-SALIDA
                Fichajes ultimaEntrada = null;
                long minutosDia = 0;
                for (Fichajes f : del_dia) {
                    if ("ENTRADA".equals(f.getTipo().name())) {
                        ultimaEntrada = f;
                    } else if ("SALIDA".equals(f.getTipo().name()) && ultimaEntrada != null) {
                        long minutos = java.time.Duration.between(
                                ultimaEntrada.getFechaHora(), f.getFechaHora()
                        ).toMinutes();
                        minutosDia += minutos;
                        ultimaEntrada = null;
                    }
                }
                if (minutosDia > 0) {
                    totalMinutos += minutosDia;
                    diasTrabajados++;
                }
            }

            long horas = totalMinutos / 60;
            long minutos = totalMinutos % 60;
            String horasEstaSemana = horas + "h " + (minutos > 0 ? minutos + "m" : "");

            long promMinutos = diasTrabajados > 0 ? totalMinutos / diasTrabajados : 0;
            long promHoras = promMinutos / 60;
            long promMin = promMinutos % 60;
            String promedioDiario = promHoras + "h " + (promMin > 0 ? promMin + "m" : "");

            response.put("status", "success");
            response.put("horasEstaSemana", horasEstaSemana.trim());
            response.put("diasTrabajados", diasTrabajados);
            response.put("promedioDiario", promedioDiario.trim());
            response.put("totalMinutos", totalMinutos);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            response.put("horasEstaSemana", "0h");
            response.put("diasTrabajados", 0);
            response.put("promedioDiario", "0h");
        }
        return response;
    }

    // En AuthController.java - añade este método
    @GetMapping("/check-users")
    public Map<String, Object> checkUsers() {
        Map<String, Object> response = new HashMap<>();
        List<Usuario> usuarios = usuarioRepository.findAll();

        response.put("totalUsuarios", usuarios.size());
        response.put("usuarios", usuarios.stream()
                .map(u -> Map.of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "nombre", u.getNombre(),
                        "rol", u.getRol()
                ))
                .collect(Collectors.toList()));

        return response;
    }
}