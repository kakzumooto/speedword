package com.kakzumooto.speedword.repository;


import com.kakzumooto.speedword.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    List<Usuario> findTop10ByOrderByRecordSegundosAsc();

}
