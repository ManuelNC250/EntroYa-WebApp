package com.entroya.controller;

import com.entroya.model.Usuario;
import com.entroya.model.Rol;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/saludo")
    public String saludo() {
        return "¡EntroYa está funcionando!";
    }

    @PostMapping("/crear-usuario")
    public String crearUsuarioTest() {
        try {
            // Verificar si ya existe el usuario de prueba
            if (usuarioRepository.findByEmail("admin@entroya.com").isPresent()) {
                return "El usuario de prueba ya existe";
            }

            Usuario usuario = new Usuario();
            usuario.setEmail("admin@entroya.com");
            usuario.setPassword("password123");
            usuario.setNombre("Administrador");
            usuario.setRol(Rol.ADMIN);

            usuarioRepository.save(usuario);
            return "Usuario de prueba creado correctamente";
        } catch (Exception e) {
            return "Error al crear usuario: " + e.getMessage();
        }
    }

    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "✅ EntroYa API Health Check - OK";
    }
}