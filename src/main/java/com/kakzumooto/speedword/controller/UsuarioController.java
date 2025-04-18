package com.kakzumooto.speedword.controller;

import com.kakzumooto.speedword.model.Usuario;
import com.kakzumooto.speedword.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario){
        return usuarioService.registrar(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario){
        String nombre = usuario.getNombreUsuario();
        String pass = usuario.getPassword();
        Optional<Usuario> encontrado = usuarioService.login(nombre, pass);

        return encontrado
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PutMapping("/{id}/record")
    public Usuario actualizarRecord(@PathVariable Long id, @RequestParam double nuevoRecord){
        return usuarioService.guardarRecord(id, nuevoRecord);
    }

    @GetMapping("/top")
    public List<Usuario> topUsuarios(){
        return usuarioService.obtenerTop10();
    }
}
