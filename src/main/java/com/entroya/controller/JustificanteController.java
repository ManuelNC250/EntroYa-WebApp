package com.entroya.controller;

import com.entroya.model.Justificante;
import com.entroya.model.TipoJustificante;
import com.entroya.model.EstadoJustificante;
import com.entroya.model.Usuario;
import com.entroya.repository.JustificanteRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/justificantes")
@CrossOrigin(origins = "*")
public class JustificanteController {

    @Autowired
    private JustificanteRepository justificanteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Trabajador: Solicitar justificante
    @PostMapping("/solicitar")
    public Map<String, String> solicitarJustificante(@RequestBody Map<String, Object> request) {
        Map<String, String> response = new HashMap<>();

        try {
            Long usuarioId = Long.valueOf(request.get("usuarioId").toString());
            TipoJustificante tipo = TipoJustificante.valueOf(request.get("tipo").toString());
            LocalDate fecha = LocalDate.parse(request.get("fecha").toString());
            String descripcion = (String) request.get("descripcion");

            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Justificante justificante = new Justificante(usuario, tipo, fecha, descripcion);
            justificanteRepository.save(justificante);

            response.put("status", "success");
            response.put("message", "Justificante solicitado correctamente");
            response.put("justificanteId", justificante.getId().toString());

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
        }

        return response;
    }

    // Trabajador: Ver mis justificantes
    @GetMapping("/usuario/{usuarioId}")
    public Map<String, Object> getJustificantesUsuario(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<Justificante> justificantes = justificanteRepository.findByUsuario(usuario);

            response.put("status", "success");
            response.put("justificantes", justificantes);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }

        return response;
    }

    // Admin: Ver todos los justificantes pendientes
    @GetMapping("/admin/pendientes")
    public List<Justificante> getJustificantesPendientes() {
        return justificanteRepository.findByEstado(EstadoJustificante.PENDIENTE);
    }

    // Admin: Aprobar/rechazar justificante
    @PutMapping("/admin/{justificanteId}")
    public Map<String, String> revisarJustificante(
            @PathVariable Long justificanteId,
            @RequestBody Map<String, String> request) {

        Map<String, String> response = new HashMap<>();

        try {
            EstadoJustificante nuevoEstado = EstadoJustificante.valueOf(request.get("estado"));
            String comentarios = request.get("comentarios");

            Justificante justificante = justificanteRepository.findById(justificanteId)
                    .orElseThrow(() -> new RuntimeException("Justificante no encontrado"));

            justificante.setEstado(nuevoEstado);
            justificante.setComentariosAdmin(comentarios);
            justificanteRepository.save(justificante);

            response.put("status", "success");
            response.put("message", "Justificante " + nuevoEstado.toString().toLowerCase());

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
        }

        return response;
    }
}