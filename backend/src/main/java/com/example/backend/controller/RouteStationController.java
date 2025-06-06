package com.example.backend.controller;

import com.example.backend.dto.StopDTO;
import com.example.backend.service.RouteStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/route-station")
@RequiredArgsConstructor
public class RouteStationController {
    private final RouteStationService routeStationService;

    @GetMapping("/stops")
    public List<StopDTO> getStops(@RequestParam UUID routeId) {
       return routeStationService.getStopsForRoute(routeId);
    }

}
