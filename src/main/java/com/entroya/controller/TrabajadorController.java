package com.entroya.controller;

import com.entroya.model.Registro;
import com.entroya.model.Usuario;
import com.entroya.repository.RegistroRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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
    private RegistroRepository registroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/historial/{usuarioId}")
    public Map<String, Object> getHistorial(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Obtener registros de hoy
            LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
            LocalDateTime finDia = LocalDate.now().atTime(23, 59, 59);

            List<Registro> registrosHoy = registroRepository.findByUsuarioAndFechaHoraBetween(
                    usuario, inicioDia, finDia);

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

    @GetMapping("/resumen/{usuarioId}")
    public Map<String, Object> getResumenSemanal(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();

        // Aquí iría la lógica para calcular horas trabajadas esta semana
        // Por ahora devolvemos un resumen básico

        response.put("status", "success");
        response.put("horasEstaSemana", "40h 15m");
        response.put("diasTrabajados", 5);
        response.put("promedioDiario", "8h 3m");

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