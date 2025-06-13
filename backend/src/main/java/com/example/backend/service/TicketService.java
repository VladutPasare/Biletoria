package com.example.backend.service;

import com.example.backend.dto.BookTicketDTO;
import com.example.backend.entity.*;
import com.example.backend.exception.ResourceNotFound;
import com.example.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
@AllArgsConstructor
public class TicketService {
    private final RouteRepository routeRepository;
    private final RouteStationRepository routeStationRepository;
    private final StationRepository stationRepository;
    private final ScheduleRepository scheduleRepository;
    private final TicketRepository ticketRepository;
    private final EmailService emailService;

    @Transactional
    public String bookTicket(BookTicketDTO bookTicketDTO) {
        Route route = routeRepository.findById(bookTicketDTO.getRouteId())
               .orElseThrow(() -> new ResourceNotFound("Route not found"));

        Station departureStation = stationRepository.findByName(bookTicketDTO.getDepartureStationName())
                .orElseThrow(() -> new ResourceNotFound("Departure Station not found!"));

        Station destinationStation = stationRepository.findByName(bookTicketDTO.getDestinationStationName())
                .orElseThrow(() -> new ResourceNotFound("Destination Station not found!"));

        List<RouteStation> routeStations = routeStationRepository.findByRouteIdOrderByStopOrder(bookTicketDTO.getRouteId());

        RouteStation departureRouteStation = routeStations.stream()
                .filter(rs -> rs.getStation().equals(departureStation))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFound("Departure station not found on this route!"));

        RouteStation destinationRouteStation = routeStations.stream()
                .filter(rs -> rs.getStation().equals(destinationStation))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFound("Destination station not found on this route!"));

        if(departureRouteStation.getStopOrder() >= destinationRouteStation.getStopOrder()) {
            throw new IllegalArgumentException("Departure station must come before destination station!");
        }

        List<RouteStation> affectedRouteStations = routeStations.stream()
                .filter(rs -> rs.getStopOrder() >= departureRouteStation.getStopOrder() && rs.getStopOrder() <= destinationRouteStation.getStopOrder())
                .sorted(Comparator.comparing(RouteStation::getStopOrder))
                .toList();

        RouteStation firstStation = routeStations.get(0);

        List<Schedule> schedules = affectedRouteStations.stream()
                .map(routeStation -> {
                    LocalTime routeStationTime = routeStation.getArrivalTime();
                    long daysDifference = routeStation.getDayOfWeek().getValue() - firstStation.getDayOfWeek().getValue();

                    if(daysDifference < 0) {
                        daysDifference += 7;
                    }

                    LocalDateTime stationArrivalTime = bookTicketDTO.getDepartureDate()
                            .plusDays(daysDifference)
                            .withHour(routeStationTime.getHour())
                            .withMinute(routeStationTime.getMinute());

                    Schedule schedule = scheduleRepository.findByRouteStation_IdAndActualArrivalTime(routeStation.getId(), stationArrivalTime)
                            .orElseGet(() -> Schedule.builder()
                                    .routeStation(routeStation)
                                    .actualArrivalTime(stationArrivalTime)
                                    .availableSeats(route.getSeats())
                                    .build());
                    if(schedule.getAvailableSeats() <= 0) {
                        throw new IllegalStateException("No available seats for route station " + routeStation.getStation().getName());
                    }

                    schedule.setAvailableSeats(schedule.getAvailableSeats() - 1);
                    return scheduleRepository.save(schedule);
                })
                .toList();

        Schedule departureSchedule = schedules.stream()
                .filter(s -> s.getRouteStation().equals(departureRouteStation))
                .findFirst()
                .orElseThrow();

        Schedule destinationSchedule = schedules.stream()
                .filter(s -> s.getRouteStation().equals(destinationRouteStation))
                .findFirst()
                .orElseThrow();

        Ticket ticket = Ticket.builder()
                .route(route)
                .departureSchedule(departureSchedule)
                .destinationSchedule(destinationSchedule)
                .firstName(bookTicketDTO.getFirstName())
                .lastName(bookTicketDTO.getLastName())
                .passengerType(bookTicketDTO.getPassengerType())
                .email(bookTicketDTO.getEmail())
                .build();
        System.out.println(departureRouteStation.getArrivalTime());
        ticket = ticketRepository.save(ticket);

        System.out.println(departureSchedule.getRouteStation().getStation().getName());
        System.out.println(departureSchedule.getRouteStation().getArrivalTime());
        System.out.println(departureSchedule.getActualArrivalTime());

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
        String formattedDate = departureSchedule.getActualArrivalTime().format(dateTimeFormatter);

        String emailContent = String.format(
            "Biletul #%s a fost rezervat cu succes!\n" +
            "Nume: %s %s\n" +
            "Rută: %s -> %s\n" +
            "Data plecării: %s\n" +
            "Călătorie plăcută!",
                ticket.getId(),
                ticket.getFirstName(),
                ticket.getLastName(),
                departureStation.getName(),
                destinationStation.getName(),
                formattedDate
        );

        emailService.sendTicket(bookTicketDTO.getEmail(), "Rezervare bilet", emailContent);
        return "Biletul #" + ticket.getId() + " a fost rezervat cu succes! Un email cu biletul a fost trimis la adreasa " + bookTicketDTO.getEmail() + ".";
    }
}
