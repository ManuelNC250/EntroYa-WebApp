package com.entroya.controller;

import com.entroya.dto.JustificanteDTO;
import com.entroya.model.Justificante;
import com.entroya.model.TipoJustificante;
import com.entroya.model.EstadoJustificante;
import com.entroya.model.Usuario;
import com.entroya.repository.JustificanteRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/justificantes")
@CrossOrigin(origins = "*")
public class JustificanteController {

    @Autowired
    private JustificanteRepository justificanteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Mapper: Justificante → JustificanteDTO (sin el byte[])
    // En el método toDTO, NO llamar a getArchivo() directamente.
// En su lugar usar archivoNombre como indicador:
    private JustificanteDTO toDTO(Justificante j) {
        JustificanteDTO dto = new JustificanteDTO();
        dto.setId(j.getId());
        dto.setUsuarioId(j.getUsuario().getId());
        dto.setUsuarioNombre(j.getUsuario().getNombre());
        dto.setTipo(j.getTipo());
        dto.setFecha(j.getFecha());
        dto.setDescripcion(j.getDescripcion());
        dto.setEstado(j.getEstado());
        dto.setComentariosAdmin(j.getComentariosAdmin());
        dto.setFechaSolicitud(j.getFechaSolicitud());
        dto.setArchivoNombre(j.getArchivoNombre());
        dto.setArchivoTipo(j.getArchivoTipo());
        // Usar archivoNombre como indicador en vez de getArchivo()
        dto.setTieneArchivo(j.getArchivoNombre() != null && !j.getArchivoNombre().isBlank());
        return dto;
    }

    // Descarga del archivo (accede al LOB solo cuando se pide explícitamente)
    @Transactional(readOnly = true)
    @GetMapping("/descargar/{id}")
    public ResponseEntity<byte[]> descargarJustificante(@PathVariable Long id) {
        Optional<Justificante> opt = justificanteRepository.findById(id);
        if (opt.isEmpty() || opt.get().getArchivo() == null) {
            return ResponseEntity.notFound().build();
        }
        Justificante j = opt.get();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(j.getArchivoTipo()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + j.getArchivoNombre() + "\"")
                .body(j.getArchivo());
    }

    // Trabajador: Solicitar justificante
    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitarJustificante(
            @RequestParam("usuarioId") Long usuarioId,
            @RequestParam("tipo") String tipo,
            @RequestParam("fecha") String fecha,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "archivo", required = false) MultipartFile archivo) {

        Map<String, Object> response = new HashMap<>();
        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Justificante justificante = new Justificante();
            justificante.setUsuario(usuario);
            justificante.setTipo(TipoJustificante.valueOf(tipo));
            justificante.setFecha(LocalDate.parse(fecha));
            justificante.setDescripcion(descripcion);
            justificante.setEstado(EstadoJustificante.PENDIENTE);

            if (archivo != null && !archivo.isEmpty()) {
                justificante.setArchivo(archivo.getBytes());
                justificante.setArchivoNombre(archivo.getOriginalFilename());
                justificante.setArchivoTipo(archivo.getContentType());
            }

            justificanteRepository.save(justificante);

            response.put("status", "success");
            response.put("message", "Justificante solicitado correctamente");
            response.put("justificanteId", justificante.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al solicitar justificante: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Trabajador: Ver mis justificantes
    @Transactional(readOnly = true)
    @GetMapping("/usuario/{usuarioId}")
    public Map<String, Object> getJustificantesUsuario(@PathVariable Long usuarioId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<JustificanteDTO> dtos = justificanteRepository
                    .findByUsuario(usuario)
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());

            response.put("status", "success");
            response.put("justificantes", dtos);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    // Admin: Ver todos los justificantes pendientes
    @Transactional(readOnly = true)
    @GetMapping("/admin/pendientes")
    public Map<String, Object> getPendientes() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<JustificanteDTO> dtos = justificanteRepository
                    .findByEstado(EstadoJustificante.PENDIENTE)
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());

            response.put("status", "success");
            response.put("justificantes", dtos);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
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