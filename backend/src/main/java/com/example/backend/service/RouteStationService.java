package com.example.backend.service;

import com.example.backend.dto.StopDTO;
import com.example.backend.entity.RouteStation;
import com.example.backend.mapper.RouteStationMapper;
import com.example.backend.repository.RouteStationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RouteStationService {
    private final RouteStationRepository routeStationRepository;
    private final RouteStationMapper routeStationMapper;

    public List<StopDTO> getStopsForRoute(UUID routeId) {
        List<RouteStation> stations = routeStationRepository.findByRouteIdOrderByStopOrder(routeId);
        return stations.stream()
                .map(routeStationMapper::toStopDTO)
                .collect(Collectors.toList());
    }
}
