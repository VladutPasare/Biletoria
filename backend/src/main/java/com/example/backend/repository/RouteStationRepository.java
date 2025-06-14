package com.example.backend.repository;

import com.example.backend.entity.RouteStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RouteStationRepository extends JpaRepository<RouteStation, UUID> {
    List<RouteStation> findByRouteIdOrderByStopOrder(UUID routeID);
}
