package com.example.backend.mapper;

import com.example.backend.dto.RouteInfoDTO;
import com.example.backend.entity.Route;
import com.example.backend.entity.RouteStation;
import com.example.backend.entity.Schedule;
import org.springframework.stereotype.Component;

import java.sql.SQLOutput;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
public class RouteMapper {
    public static Optional<RouteInfoDTO> toRouteInfoDTO(Route route, String departureStationName, String arrivalStationName, String departureDate, int adults, int children) {
        List<RouteStation> orderedStations = route.getRouteStations()
                .stream()
                .sorted(Comparator.comparing(RouteStation::getStopOrder))
                .toList();

        int departureStationIndex = -1;
        int arrivalStationIndex = -1;

        for(int i = 0; i < orderedStations.size(); i++) {
            String stationName = orderedStations.get(i).getStation().getName();

            if (stationName.equalsIgnoreCase(departureStationName)) {
                departureStationIndex = i;
            }
            if (stationName.equalsIgnoreCase(arrivalStationName)) {
                arrivalStationIndex = i;
            }
        }

        if(departureStationIndex == -1 || arrivalStationIndex == -1 || departureStationIndex >= arrivalStationIndex) {
            return Optional.empty();
        }

        LocalDate date = LocalDate.parse(departureDate);

        DayOfWeek dayOfWeek = date.getDayOfWeek();

        RouteStation departureRouteStation = orderedStations.get(departureStationIndex);
        RouteStation arrivalRouteStation = orderedStations.get(arrivalStationIndex);

        if(departureRouteStation.getDayOfWeek().getValue() != dayOfWeek.getValue()) {
            return Optional.empty();
        }
        System.out.println("\n" + departureRouteStation.getDayOfWeek());
        Optional<Schedule> departureSchedule = departureRouteStation.getSchedules()
               .stream()
               .filter(s -> s.getActualArrivalTime().toLocalDate().equals(date))
               .findFirst();

        LocalDateTime actualDeparture;
        int availableSeats;

        if(departureSchedule.isPresent()) {
            actualDeparture = departureSchedule.get().getActualArrivalTime();
            availableSeats = departureSchedule.get().getAvailableSeats();
        }
        else {
            LocalTime departureTime = departureRouteStation.getArrivalTime();
            actualDeparture = LocalDateTime.of(date, departureTime);
            availableSeats = route.getSeats();
        }

        LocalTime departureTime = departureRouteStation.getArrivalTime();
        LocalTime arrivalTime = arrivalRouteStation.getArrivalTime();

        long travelMinutes = java.time.Duration.between(departureTime, arrivalTime).toMinutes();
        LocalDateTime actualArrival = actualDeparture.plusMinutes(travelMinutes);

        RouteInfoDTO routeInfoDTO = RouteInfoDTO.builder()
                .id(route.getId())
                .departureLocation(departureRouteStation.getStation().getName())
                .departureTime(actualDeparture)
                .arrivalLocation(arrivalRouteStation.getStation().getName())
                .arrivalTime(actualArrival)
                .company(route.getBusCompany().getName())
                .availableSeats(availableSeats)
                //.price(price)
                .adultPrice(arrivalRouteStation.getPriceAdult() - departureRouteStation.getPriceAdult())
                .childPrice(arrivalRouteStation.getPriceChild() - departureRouteStation.getPriceChild())
                .build();

        return Optional.of(routeInfoDTO);
    }
}
