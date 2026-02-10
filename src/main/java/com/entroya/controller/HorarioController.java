package com.entroya.controller;

import com.entroya.dto.HorarioRequest;
import com.entroya.model.Horario;
import com.entroya.model.Usuario;
import com.entroya.repository.HorarioRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Admin: Asignar horario a usuario
    @PostMapping("/asignar")
    public ResponseEntity<?> asignarHorario(@RequestBody HorarioRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(request.getUsuarioId());
            if (usuarioOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }

            Horario horario = new Horario();
            horario.setUsuario(usuarioOpt.get());
            horario.setNombre(request.getNombre());
            horario.setHoraEntrada(request.getHoraEntrada());
            horario.setHoraSalida(request.getHoraSalida());
            horario.setDiasSemana(request.getDiasSemana());

            horarioRepository.save(horario);

            response.put("status", "success");
            response.put("message", "Horario asignado correctamente");
            response.put("horarioId", horario.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al asignar horario: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Trabajador: Ver mis horarios
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getHorariosUsuario(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Horario> horarios = horarioRepository.findByUsuarioId(usuarioId);
            response.put("status", "success");
            response.put("horarios", horarios);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener horarios: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Admin: Ver todos los horarios
    @GetMapping("/admin")
    public List<Horario> getAllHorarios() {
        return horarioRepository.findAll();
    }

    // Desactivar horario
    @PutMapping("/{horarioId}/desactivar")
    public ResponseEntity<?> desactivarHorario(@PathVariable Long horarioId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Horario> horarioOpt = horarioRepository.findById(horarioId);
            if (horarioOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Horario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }

            Horario horario = horarioOpt.get();
            horario.setActivo(false);
            horarioRepository.save(horario);

            response.put("status", "success");
            response.put("message", "Horario desactivado correctamente");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al desactivar horario: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}