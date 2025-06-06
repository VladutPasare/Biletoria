package com.example.backend.mapper;

import com.example.backend.dto.RouteInfoDTO;
import com.example.backend.entity.Route;
import com.example.backend.entity.RouteStation;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
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

        LocalDate date = LocalDate.parse(departureDate);

       if(departureStationIndex != -1 && arrivalStationIndex != -1 && departureStationIndex < arrivalStationIndex) {
           RouteStation departureRouteStation = orderedStations.get(departureStationIndex);
           RouteStation arrivalRouteStation = orderedStations.get(arrivalStationIndex);

           LocalDate routeDate = departureRouteStation.getArrivalTime().toLocalDate();

           if(!date.equals(routeDate)) {
               return Optional.empty();
           }

           // fa numarul de seats aici

           Double price = (arrivalRouteStation.getPriceAdult() - departureRouteStation.getPriceAdult()) * adults +
                   (arrivalRouteStation.getPriceChild() - departureRouteStation.getPriceChild()) * children;
           RouteInfoDTO routeInfoDTO = RouteInfoDTO.builder()
                   .id(route.getId())
                   .departureLocation(departureRouteStation.getStation().getName())
                   .departureTime(departureRouteStation.getArrivalTime())
                   .arrivalLocation(arrivalRouteStation.getStation().getName())
                   .arrivalTime(arrivalRouteStation.getArrivalTime())
                   .company(route.getBusCompany().getName())
                   .availableSeats(10)
                   .price(price)
                   .build();

           return Optional.of(routeInfoDTO);
       }

       return Optional.empty();
    }
}
