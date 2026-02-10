package com.entroya.repository;

import com.entroya.model.Registro;
import com.entroya.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    List<Registro> findByUsuario(Usuario usuario);
    List<Registro> findByUsuarioAndFechaHoraBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fin);
}