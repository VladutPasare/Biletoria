package com.example.backend.mapper;

import com.example.backend.dto.StationDTO;
import com.example.backend.entity.Station;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StationMapper {
    public StationDTO toStationDTO(Station station) {
        return StationDTO.builder()
                .name(station.getName())
                .latitude(station.getLatitude())
                .longitude(station.getLongitude())
                .build();
    }

    public List<StationDTO> toStationDTOList(List<Station> stations) {
        return stations.stream()
                .map(this::toStationDTO)
                .toList();
    }
}
