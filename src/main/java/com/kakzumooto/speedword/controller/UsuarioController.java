package com.kakzumooto.speedword.controller;

import com.kakzumooto.speedword.model.Usuario;
import com.kakzumooto.speedword.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registrarUsuario(@RequestBody Usuario usuarioNuevo) {
        Map<String, Object> respuesta = usuarioService.registrarOActualizarUsuario(usuarioNuevo);
        return ResponseEntity.ok(respuesta);
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

    @PostMapping("/guardar-record")
    public ResponseEntity<Map<String, Object>> guardarRecordAutomatico(@RequestBody Usuario usuarioNuevo) {
        Map<String, Object> respuesta = usuarioService.registrarOActualizarUsuario(usuarioNuevo);
        return ResponseEntity.ok(respuesta);
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
