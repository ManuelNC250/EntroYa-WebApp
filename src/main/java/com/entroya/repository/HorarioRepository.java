package com.entroya.repository;

import com.entroya.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByUsuarioId(Long usuarioId);
    List<Horario> findByActivoTrue();
    void deleteByUsuarioId(Long id);
}