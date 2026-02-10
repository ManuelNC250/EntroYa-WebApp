package com.entroya.controller;

import com.entroya.dto.NominaRequest;
import com.entroya.model.Nomina;
import com.entroya.model.Usuario;
import com.entroya.repository.NominaRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/nominas")
@CrossOrigin(origins = "*")
public class NominaController {

    @Autowired
    private NominaRepository nominaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Admin: Subir nómina
    @PostMapping("/subir")
    public ResponseEntity<?> subirNomina(@RequestBody NominaRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(request.getUsuarioId());
            if (usuarioOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }

            // Verificar si ya existe nómina para ese mes y año
            Optional<Nomina> nominaExistente = nominaRepository.findByUsuarioIdAndMesAndAno(
                    request.getUsuarioId(), request.getMes(), request.getAno());

            if (nominaExistente.isPresent()) {
                response.put("status", "error");
                response.put("message", "Ya existe una nómina para este usuario en el periodo seleccionado");
                return ResponseEntity.badRequest().body(response);
            }

            Nomina nomina = new Nomina();
            nomina.setUsuario(usuarioOpt.get());
            nomina.setMes(request.getMes());
            nomina.setAno(request.getAno());
            nomina.setArchivoNombre(request.getArchivoNombre());
            nomina.setArchivoUrl(request.getArchivoUrl());
            nomina.setArchivoTipo(request.getArchivoTipo());
            nomina.setArchivoTamanio(request.getArchivoTamanio());
            nomina.setComentarios(request.getComentarios());

            nominaRepository.save(nomina);

            response.put("status", "success");
            response.put("message", "Nómina subida correctamente");
            response.put("nominaId", nomina.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al subir nómina: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Trabajador: Ver mis nóminas
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getNominasUsuario(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Nomina> nominas = nominaRepository.findByUsuarioId(usuarioId);
            response.put("status", "success");
            response.put("nominas", nominas);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener nóminas: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Admin: Ver todas las nóminas
    @GetMapping("/admin")
    public List<Nomina> getAllNominas() {
        return nominaRepository.findAll();
    }

    // Eliminar nómina
    @DeleteMapping("/{nominaId}")
    public ResponseEntity<?> eliminarNomina(@PathVariable Long nominaId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Nomina> nominaOpt = nominaRepository.findById(nominaId);
            if (nominaOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Nómina no encontrada");
                return ResponseEntity.badRequest().body(response);
            }

            nominaRepository.delete(nominaOpt.get());

            response.put("status", "success");
            response.put("message", "Nómina eliminada correctamente");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al eliminar nómina: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}