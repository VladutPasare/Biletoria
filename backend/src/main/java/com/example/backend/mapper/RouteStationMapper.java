package com.example.backend.mapper;

import com.example.backend.dto.StopDTO;
import com.example.backend.entity.Facility;
import com.example.backend.entity.RouteStation;
import com.example.backend.entity.Station;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.stream.Collectors;

@Component
public class RouteStationMapper {
    public StopDTO toStopDTO(RouteStation routeStation, LocalDate referenceDate) {
        Station station = routeStation.getStation();
        LocalDate arrivalDate = calculateArrivalDate(referenceDate, routeStation.getDayOfWeek());
        LocalDateTime exactArrivalDateTime = LocalDateTime.of(arrivalDate, routeStation.getArrivalTime());

        return StopDTO.builder()
                .stationId(station.getId())
                .name(station.getName())
                .latitude(station.getLatitude())
                .longitude(station.getLongitude())
                .exactArrivalTime(exactArrivalDateTime)
                .facilities(station.getFacilities().stream()
                        .map(Facility::getName)
                        .collect(Collectors.toList()))
                .build();
    }

    private LocalDate calculateArrivalDate(LocalDate referenceDate, DayOfWeek stationDayOfWeek) {
        int daysToAdd = (stationDayOfWeek.getValue() - referenceDate.getDayOfWeek().getValue() + 7) % 7;
        return referenceDate.plusDays(daysToAdd);
    }
}
