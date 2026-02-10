package com.entroya.repository;

import com.entroya.model.Nomina;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NominaRepository extends JpaRepository<Nomina, Long> {
    List<Nomina> findByUsuarioId(Long usuarioId);
    Optional<Nomina> findByUsuarioIdAndMesAndAno(Long usuarioId, Integer mes, Integer ano);
}