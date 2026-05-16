package com.entroya.repository;

import com.entroya.model.Justificante;
import com.entroya.model.Usuario;
import com.entroya.model.EstadoJustificante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JustificanteRepository extends JpaRepository<Justificante, Long> {
    List<Justificante> findByUsuario(Usuario usuario);
    List<Justificante> findByEstado(EstadoJustificante estado);
    List<Justificante> findByUsuarioAndEstado(Usuario usuario, EstadoJustificante estado);
    long countByEstado(EstadoJustificante estado);
}