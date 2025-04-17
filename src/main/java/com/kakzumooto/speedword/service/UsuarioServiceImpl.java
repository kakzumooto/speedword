package com.kakzumooto.speedword.service;

import com.kakzumooto.speedword.model.Usuario;
import com.kakzumooto.speedword.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl  implements UsuarioService{

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Usuario registrar(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> login(String nombreUsuario, String password) {
        Optional<Usuario> usuario= usuarioRepository.findByNombreUsuario(nombreUsuario);
        return usuario.filter(u -> u.getPassword().equals(password));
    }

    @Override
    public Usuario guardarRecord(Long id, double nuevoRecord){
        Usuario usuario= usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if(usuario.getRecordSegundos()== null || nuevoRecord < usuario.getRecordSegundos()){
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
}
