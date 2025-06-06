package com.example.backend.service;

import com.example.backend.dto.StationDTO;
import com.example.backend.mapper.StationMapper;
import com.example.backend.repository.StationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StationService {
    private final StationRepository stationRepository;
    private final StationMapper stationMapper;

    public List<StationDTO> getAllStations() {
        return stationMapper.toStationDTOList(stationRepository.findAll());
    }
}
