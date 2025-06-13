package com.example.backend.service;

import com.example.backend.dto.StopDTO;
import com.example.backend.entity.RouteStation;
import com.example.backend.mapper.RouteStationMapper;
import com.example.backend.repository.RouteStationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RouteStationService {
    private final RouteStationRepository routeStationRepository;
    private final RouteStationMapper routeStationMapper;

    public List<StopDTO> getStopsForRouteBetweenStations(UUID routeId, LocalDate referenceDate, String destination, String departure) {
        List<RouteStation> stations = routeStationRepository.findByRouteIdOrderByStopOrder(routeId);

        int startIndex = -1;
        int endIndex = -1;

        for(int i = 0; i < stations.size(); i++) {
            String stationName = stations.get(i).getStation().getName();

            if(stationName.equalsIgnoreCase(departure)) {
                startIndex = i;
            }

            if(stationName.equalsIgnoreCase(destination)) {
                endIndex = i;
            }
        }

        if(startIndex == -1 || endIndex == -1 || startIndex > endIndex) {
            return List.of();
        }

        return stations.subList(startIndex, endIndex + 1).stream()
                .map(rs -> routeStationMapper.toStopDTO(rs, referenceDate))
                .collect(Collectors.toList());
    }
}
