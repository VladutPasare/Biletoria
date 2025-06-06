package com.example.backend.service;

import com.example.backend.dto.RouteInfoDTO;
import com.example.backend.mapper.RouteMapper;
import com.example.backend.repository.RouteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;

    public List<RouteInfoDTO> searchRoutes(String departureStationName, String arrivalStationName, String departureDate, int adults, int children) {
        return routeRepository.findAll().stream()
                .map(route -> RouteMapper.toRouteInfoDTO(route, departureStationName, arrivalStationName, departureDate, adults, children))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
    }
}
