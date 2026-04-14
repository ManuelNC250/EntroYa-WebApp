package com.entroya.controller;

import com.entroya.model.Nomina;
import com.entroya.model.Usuario;
import com.entroya.repository.NominaRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/nominas")
@CrossOrigin(origins = "*")
public class NominaController {

    @Autowired
    private NominaRepository nominaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // DTO interno para no serializar el byte[]
    private Map<String, Object> toDTO(Nomina n) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", n.getId());
        dto.put("usuarioId", n.getUsuario().getId());
        dto.put("usuarioNombre", n.getUsuario().getNombre());
        dto.put("mes", n.getMes());
        dto.put("ano", n.getAno());
        dto.put("archivoNombre", n.getArchivoNombre());
        dto.put("archivoTipo", n.getArchivoTipo());
        dto.put("archivoTamanio", n.getArchivoTamanio());
        dto.put("fechaSubida", n.getFechaSubida());
        dto.put("comentarios", n.getComentarios());
        return dto;
    }

    // Admin: Subir nómina
    @PostMapping("/subir")
    public ResponseEntity<?> subirNomina(
            @RequestParam("usuarioId") Long usuarioId,
            @RequestParam("mes") Integer mes,
            @RequestParam("ano") Integer ano,
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam(value = "comentarios", required = false) String comentarios) {

        Map<String, Object> response = new HashMap<>();
        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Optional<Nomina> existente = nominaRepository.findByUsuarioIdAndMesAndAno(usuarioId, mes, ano);
            if (existente.isPresent()) {
                response.put("status", "error");
                response.put("message", "Ya existe una nomina para este periodo");
                return ResponseEntity.badRequest().body(response);
            }

            Nomina nomina = new Nomina();
            nomina.setUsuario(usuario);
            nomina.setMes(mes);
            nomina.setAno(ano);
            nomina.setArchivoNombre(archivo.getOriginalFilename());
            nomina.setArchivoTipo(archivo.getContentType());
            nomina.setArchivoTamanio((int) archivo.getSize());
            nomina.setArchivoContenido(archivo.getBytes());
            nomina.setArchivoUrl("");
            nomina.setComentarios(comentarios);

            nominaRepository.save(nomina);

            response.put("status", "success");
            response.put("message", "Nomina subida correctamente");
            response.put("nominaId", nomina.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al subir nomina: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Trabajador: Ver mis nóminas
    @Transactional(readOnly = true)
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getNominasUsuario(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> dtos = nominaRepository.findByUsuarioId(usuarioId)
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
            response.put("status", "success");
            response.put("nominas", dtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Admin: Ver todas las nóminas
    @Transactional(readOnly = true)
    @GetMapping("/admin")
    public ResponseEntity<?> getAllNominas() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> dtos = nominaRepository.findAll()
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
            response.put("status", "success");
            response.put("nominas", dtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Eliminar nómina
    @DeleteMapping("/eliminar/{nominaId}")
    public ResponseEntity<?> eliminarNomina(@PathVariable Long nominaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!nominaRepository.existsById(nominaId)) {
                response.put("status", "error");
                response.put("message", "Nomina no encontrada");
                return ResponseEntity.badRequest().body(response);
            }
            nominaRepository.deleteById(nominaId);
            response.put("status", "success");
            response.put("message", "Nomina eliminada correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al eliminar: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Descarga del archivo
    @Transactional(readOnly = true)
    @GetMapping("/descargar/{id}")
    public ResponseEntity<byte[]> descargarNomina(@PathVariable Long id) {
        Optional<Nomina> opt = nominaRepository.findById(id);
        if (opt.isEmpty() || opt.get().getArchivoContenido() == null) {
            return ResponseEntity.notFound().build();
        }
        Nomina n = opt.get();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(n.getArchivoTipo()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + n.getArchivoNombre() + "\"")
                .body(n.getArchivoContenido());
    }
}