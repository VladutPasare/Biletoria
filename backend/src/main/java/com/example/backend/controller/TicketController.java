package com.example.backend.controller;

import com.example.backend.dto.BookTicketDTO;
import com.example.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/ticket")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<Map<String, String>> bookTicket(@RequestBody BookTicketDTO bookTicketDTO) {
        String confirmation = ticketService.bookTicket(bookTicketDTO);
        return ResponseEntity.ok(Collections.singletonMap("message", confirmation));
    }
}
