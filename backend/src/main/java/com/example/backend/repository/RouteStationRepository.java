package com.example.backend.repository;

import com.example.backend.entity.RouteStation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RouteStationRepository extends JpaRepository<RouteStation, UUID> {
    List<RouteStation> findByRouteIdOrderByStopOrder(UUID routeID);
}
