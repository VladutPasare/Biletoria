package com.example.backend.controller;

import com.example.backend.dto.StationDTO;
import com.example.backend.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StationController {
    private final StationService stationService;

    @GetMapping("/stations")
    public ResponseEntity<List<StationDTO>> getAllStations() {
        return ResponseEntity.ok(stationService.getAllStations());
    }
}
