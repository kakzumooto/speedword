package com.kakzumooto.speedword.service;

import com.kakzumooto.speedword.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    Usuario registrar(Usuario usuario);

    Optional<Usuario> login(String nombreUsuario, String password);

    Usuario guardarRecord(Long id, double nuevoRecord);

    List<Usuario> obtenerTop10();


}
