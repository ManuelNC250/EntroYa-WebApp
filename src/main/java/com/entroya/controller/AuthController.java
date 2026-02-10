package com.entroya.controller;

import com.entroya.model.LoginRequest;
import com.entroya.model.Usuario;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

            if (usuarioOpt.isPresent() && usuarioOpt.get().getPassword().equals(loginRequest.getPassword())) {
                Usuario usuario = usuarioOpt.get();

                response.put("status", "success");
                response.put("message", "Login exitoso");
                response.put("usuario", Map.of(
                        "id", usuario.getId(),
                        "nombre", usuario.getNombre(),
                        "email", usuario.getEmail(),
                        "rol", usuario.getRol()
                ));

                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Credenciales incorrectas");
                return ResponseEntity.status(401).body(response);
            }

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/check-users")
    public Map<String, Object> checkUsers() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Usuario> usuarios = usuarioRepository.findAll();

            response.put("status", "success");
            response.put("totalUsuarios", usuarios.size());
            response.put("usuarios", usuarios.stream()
                    .map(u -> Map.of(
                            "id", u.getId(),
                            "email", u.getEmail(),
                            "nombre", u.getNombre(),
                            "rol", u.getRol().toString()
                    ))
                    .collect(Collectors.toList()));

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener usuarios: " + e.getMessage());
        }

        return response;
    }
}