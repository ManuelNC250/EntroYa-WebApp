package com.entroya.repository;

import com.entroya.model.TarjetaNfc;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TarjetaNfcRepository extends JpaRepository<TarjetaNfc, Long> {
    Optional<TarjetaNfc> findByUid(String uid);
    Optional<TarjetaNfc> findByUsuarioId(Long usuarioId);
    boolean existsByUid(String uid);
}