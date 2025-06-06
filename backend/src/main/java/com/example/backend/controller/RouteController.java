package com.example.backend.controller;

import com.example.backend.dto.RouteInfoDTO;
import com.example.backend.dto.StationDTO;
import com.example.backend.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/route")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService routeService;

    @GetMapping("/search")
    public List<RouteInfoDTO> search_routes(@RequestParam String departureStationName,
                                            @RequestParam String arrivalStationName,
                                            @RequestParam String departureDate,
                                            @RequestParam int adults,
                                            @RequestParam int children) {
        return routeService.searchRoutes(departureStationName, arrivalStationName, departureDate, adults, children);
    }
}
