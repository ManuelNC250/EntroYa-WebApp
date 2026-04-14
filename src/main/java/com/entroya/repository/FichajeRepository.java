package com.entroya.repository;

import com.entroya.model.Fichajes;
import com.entroya.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface FichajeRepository extends JpaRepository<Fichajes, Long> {
    List<Fichajes> findByUsuario(Usuario usuario);
    List<Fichajes> findByUsuarioAndFechaHoraBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fin);
    List<Fichajes> findByUsuarioOrderByFechaHoraDesc(Usuario usuario);
}