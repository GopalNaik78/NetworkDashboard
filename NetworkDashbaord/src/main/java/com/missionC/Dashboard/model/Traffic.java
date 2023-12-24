package com.missionC.Dashboard.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table(name="networktraffic")
public class Traffic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long iD;
    private Long deviceid;
    private Timestamp timestamp;
    private Long inboundtraffic;
    private Long outboundtraffic;
}
