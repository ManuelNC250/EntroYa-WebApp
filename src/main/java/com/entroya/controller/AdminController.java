package com.entroya.controller;

import com.entroya.model.Usuario;
import com.entroya.repository.UsuarioRepository;
import com.entroya.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RegistroRepository registroRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        // Estadísticas básicas
        long totalUsuarios = usuarioRepository.count();
        long totalAdmins = usuarioRepository.findAll().stream()
                .filter(u -> u.getRol().name().equals("ADMIN"))
                .count();
        long totalTrabajadores = totalUsuarios - totalAdmins;

        dashboard.put("totalUsuarios", totalUsuarios);
        dashboard.put("totalAdmins", totalAdmins);
        dashboard.put("totalTrabajadores", totalTrabajadores);
        dashboard.put("status", "success");

        return dashboard;
    }

    @GetMapping("/usuarios")
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }
}