package com.entroya.controller;

import com.entroya.dto.AsignarTarjetaRequest;
import com.entroya.dto.NfcFichajeRequest;
import com.entroya.model.*;
import com.entroya.repository.RegistroRepository;
import com.entroya.repository.TarjetaNfcRepository;
import com.entroya.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/nfc")
@CrossOrigin(origins = "*")
public class NfcController {

    @Autowired
    private TarjetaNfcRepository tarjetaNfcRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RegistroRepository registroRepository;

    // Endpoint para la app NFC de fichaje
    @PostMapping("/fichaje")
    public ResponseEntity<?> ficharConNFC(@RequestBody NfcFichajeRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Buscar tarjeta por UID
            Optional<TarjetaNfc> tarjetaOpt = tarjetaNfcRepository.findByUid(request.getCardUid());
            if (tarjetaOpt.isEmpty() || !tarjetaOpt.get().getActiva()) {
                response.put("status", "error");
                response.put("message", "Tarjeta no registrada o inactiva");
                return ResponseEntity.badRequest().body(response);
            }

            TarjetaNfc tarjeta = tarjetaOpt.get();
            Usuario usuario = tarjeta.getUsuario();

            // Determinar automáticamente si es entrada o salida
            TipoRegistro tipo = determinarTipoFichaje(usuario);

            // Crear registro de fichaje
            Registro registro = new Registro(usuario, tipo);
            registroRepository.save(registro);

            response.put("status", "success");
            response.put("message", tipo + " registrado correctamente");
            response.put("usuario", usuario.getNombre());
            response.put("tipo", tipo.toString());
            response.put("hora", LocalDateTime.now().toString());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error en el fichaje: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Admin: Asignar tarjeta a usuario
    @PostMapping("/asignar")
    public ResponseEntity<?> asignarTarjeta(@RequestBody AsignarTarjetaRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(request.getUsuarioId());
            if (usuarioOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }

            // Verificar si la tarjeta ya está asignada
            if (tarjetaNfcRepository.existsByUid(request.getUid())) {
                response.put("status", "error");
                response.put("message", "Esta tarjeta ya está asignada a otro usuario");
                return ResponseEntity.badRequest().body(response);
            }

            // Verificar si el usuario ya tiene tarjeta
            Optional<TarjetaNfc> tarjetaExistente = tarjetaNfcRepository.findByUsuarioId(request.getUsuarioId());
            if (tarjetaExistente.isPresent()) {
                response.put("status", "error");
                response.put("message", "Este usuario ya tiene una tarjeta asignada");
                return ResponseEntity.badRequest().body(response);
            }

            TarjetaNfc tarjeta = new TarjetaNfc(usuarioOpt.get(), request.getUid());
            tarjetaNfcRepository.save(tarjeta);

            response.put("status", "success");
            response.put("message", "Tarjeta asignada correctamente");
            response.put("tarjetaId", tarjeta.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al asignar tarjeta: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Admin: Ver todas las tarjetas
    @GetMapping("/admin")
    public List<TarjetaNfc> getAllTarjetas() {
        return tarjetaNfcRepository.findAll();
    }

    // Método para determinar automáticamente entrada/salida
    private TipoRegistro determinarTipoFichaje(Usuario usuario) {
        // Obtener registros de hoy
        LocalDateTime inicioDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime finDia = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        List<Registro> registrosHoy = registroRepository.findByUsuarioAndFechaHoraBetween(usuario, inicioDia, finDia);

        if (registrosHoy.isEmpty()) {
            return TipoRegistro.ENTRADA;
        }

        // Obtener el último registro
        Registro ultimoRegistro = registrosHoy.get(registrosHoy.size() - 1);
        return (ultimoRegistro.getTipo() == TipoRegistro.ENTRADA) ? TipoRegistro.SALIDA : TipoRegistro.ENTRADA;
    }
}