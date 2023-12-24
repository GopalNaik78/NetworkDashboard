package com.missionC.Dashboard.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table(name="networkhealthmetrics")
public class Health {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long metricID;
    private Long deviceID;
    private Timestamp timestamp;
    private Long latency;
    private Long throughput;
    private float packetlossrate;
    private float uptime;
}
