package com.kakzumooto.speedword.service;

import com.kakzumooto.speedword.model.Usuario;
import com.kakzumooto.speedword.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Usuario registrar(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> login(String nombreUsuario, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByNombreUsuario(nombreUsuario);
        return usuario.filter(u -> u.getPassword().equals(password));
    }

    @Override
    public Usuario guardarRecord(Long id, double nuevoRecord){
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRecordSegundos() == null || nuevoRecord < usuario.getRecordSegundos()) {
            usuario.setRecordSegundos(nuevoRecord);
            usuario.setFechaRecord(LocalDateTime.now());
            return usuarioRepository.save(usuario);
        }

        return usuario;
    }

    @Override
    public List<Usuario> obtenerTop10() {
        return usuarioRepository.findTop10ByOrderByRecordSegundosAsc();
    }

    @Override
    public Map<String, Object> registrarOActualizarUsuario(Usuario usuarioNuevo) {
        Map<String, Object> respuesta = new HashMap<>();
        boolean esNuevoRecord = false;

        Usuario usuarioExistente = usuarioRepository.findByNombreUsuario(usuarioNuevo.getNombreUsuario())
                .orElse(null);

        if (usuarioExistente == null) {
            usuarioNuevo.setFechaRecord(LocalDateTime.now());
            usuarioRepository.save(usuarioNuevo);
            esNuevoRecord = true;
        } else if (usuarioNuevo.getRecordSegundos() < usuarioExistente.getRecordSegundos()) {
            usuarioExistente.setRecordSegundos(usuarioNuevo.getRecordSegundos());
            usuarioExistente.setFechaRecord(LocalDateTime.now());
            usuarioRepository.save(usuarioExistente);
            esNuevoRecord = true;
        }

        List<Usuario> top10 = usuarioRepository.findTop10ByOrderByRecordSegundosAsc();
        boolean estaEnTop10 = top10.stream()
                .anyMatch(u -> u.getNombreUsuario().equals(usuarioNuevo.getNombreUsuario()));

        respuesta.put("mensaje", esNuevoRecord ? "Record actualizado" : "No fue un nuevo récord");
        respuesta.put("enTop10", estaEnTop10);

        return respuesta;
    }
}
