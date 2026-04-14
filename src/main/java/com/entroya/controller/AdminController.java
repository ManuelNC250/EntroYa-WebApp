package com.entroya.controller;

import com.entroya.model.Rol;
import com.entroya.model.Usuario;
import com.entroya.repository.FichajeRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private FichajeRepository fichajeRepository;

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

    // Crear usuario
    @PostMapping("/usuarios")
    public ResponseEntity<?> crearUsuario(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Verificar email duplicado
            if (usuarioRepository.findByEmail(request.get("email")).isPresent()) {
                response.put("status", "error");
                response.put("message", "Ya existe un usuario con ese email");
                return ResponseEntity.badRequest().body(response);
            }

            Usuario usuario = new Usuario();
            usuario.setNombre(request.get("nombre"));
            usuario.setEmail(request.get("email"));
            usuario.setPassword(request.get("password")); // En producción: encriptar
            usuario.setRol(Rol.valueOf(request.get("rol")));
            usuario.setDepartamento(request.get("departamento"));

            usuarioRepository.save(usuario);

            response.put("status", "success");
            response.put("message", "Usuario creado correctamente");
            response.put("usuarioId", usuario.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al crear usuario: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Actualizar usuario
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (request.get("nombre") != null) usuario.setNombre(request.get("nombre"));
            if (request.get("email") != null) usuario.setEmail(request.get("email"));
            if (request.get("departamento") != null) usuario.setDepartamento(request.get("departamento"));
            if (request.get("rol") != null) usuario.setRol(Rol.valueOf(request.get("rol")));
            if (request.get("password") != null && !request.get("password").isBlank()) {
                usuario.setPassword(request.get("password"));
            }

            usuarioRepository.save(usuario);

            response.put("status", "success");
            response.put("message", "Usuario actualizado correctamente");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al actualizar: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Eliminar usuario
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!usuarioRepository.existsById(id)) {
                response.put("status", "error");
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.notFound().build();
            }
            usuarioRepository.deleteById(id);
            response.put("status", "success");
            response.put("message", "Usuario eliminado correctamente");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al eliminar: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}