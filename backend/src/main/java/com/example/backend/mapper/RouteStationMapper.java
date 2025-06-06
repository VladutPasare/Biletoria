package com.example.backend.mapper;

import com.example.backend.dto.StopDTO;
import com.example.backend.entity.Facility;
import com.example.backend.entity.RouteStation;
import com.example.backend.entity.Station;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class RouteStationMapper {
    public StopDTO toStopDTO(RouteStation routeStation) {
        Station station = routeStation.getStation();
        return new StopDTO(
                station.getId(),
                station.getName(),
                station.getLatitude(),
                station.getLongitude(),
                routeStation.getArrivalTime(),
                station.getFacilities().stream()
                        .map(Facility::getName)
                        .collect(Collectors.toList())
        );
    }
}
