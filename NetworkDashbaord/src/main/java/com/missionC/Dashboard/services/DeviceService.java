package com.missionC.Dashboard.services;

import com.missionC.Dashboard.dao.*;
import com.missionC.Dashboard.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class DeviceService {

    @Autowired
    DevicesDao devicesDao;

    @Autowired
    AlertDao alertDao;
    @Autowired
    DevicesStatusHistoryDao devicesStatusHistoryDao;

    @Autowired
    HealthDao healthDao;
    public ResponseEntity<List<Devices>> getAllDevices() {
        return new ResponseEntity<>(devicesDao.findAll(), HttpStatus.OK);
    }
    public ResponseEntity<List<Long>> getAllDevicesIds() {
        List<Long> deviceIds = devicesDao.findAllDeviceID();
        return ResponseEntity.ok(deviceIds);
    }
    public ResponseEntity<Devices> getDevice(Long deviceId) {
        Optional<Devices>  deviceOptional= devicesDao.findById(deviceId);
        return new ResponseEntity<>(deviceOptional.get(), HttpStatus.OK);
    }
    public ResponseEntity<List<AlertTable>> getAllAlert() {
        return  new ResponseEntity<>(alertDao.findAll(), HttpStatus.OK);
    }

    public ResponseEntity<List<AlertTable>> getAlerts(Long deviceId) {
        return new ResponseEntity<>(alertDao.getByDeviceid(deviceId), HttpStatus.OK);
    }


    public ResponseEntity<List<DeviceStatusHistory>> getAllDeviceStatusHistory() {
        List<DeviceStatusHistory> history = devicesStatusHistoryDao.findAll();
        // Add logging
        System.out.println("Retrieved device status history: " + history);
        return new ResponseEntity<>(history, HttpStatus.OK);
    }

    public Integer getOnlineRouterCount() {
        return devicesDao.countByDevicetypeAndDevicestatus("Router","Online");
    }
    public Integer getOfflineRouterCount() {
        return devicesDao.countByDevicetypeAndDevicestatus("Router","Offline");
    }

    public Integer getOnlineSwitchCount() {
        return devicesDao.countByDevicetypeAndDevicestatus("Switch","Online");
    }

    public Integer getOfflineSwitchCount() {
        return devicesDao.countByDevicetypeAndDevicestatus("Switch","Offline");
    }

    public Integer getOnlineServerCount() {
        return devicesDao.countByDevicetypeAndDevicestatus("Server","Online");
    }

    public Integer getOfflineServerCount() {
        return devicesDao.countByDevicetypeAndDevicestatus("Server","Offline");
    }

    public Integer getAlertCount(Long deviceId, String status, String RevStatus) {
        return alertDao.countByDeviceidAndStatusAndReviewstatus(deviceId,status,RevStatus);
    }

    public ResponseEntity<List<Health>> getAllHealth() {
        return new ResponseEntity<>(healthDao.findAll(), HttpStatus.OK);
    }

    public List<Map<String, Object>> getTimestampAndPacketLoss(Long deviceId) {
        List<Object[]> healthData = healthDao.findTimestampAndPacketLoss(deviceId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] data : healthData) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("timestamp", (Timestamp) data[0]);
            entry.put("packetLossRate", (Float) data[1]);
            result.add(entry);
        }
        return result;
    }
    public List<Map<String, Object>> getAllPacket(List<String> deviceTypes) {
        // Fetch devices based on deviceTypes
        List<Devices> devices = ("All".equals(deviceTypes.get(0))) ? devicesDao.findAll() : devicesDao.findByDevicetypeIn(deviceTypes);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Devices device : devices) {
            // For each device, fetch timestamp and packetlossrate
            List<Object[]> healthData = healthDao.findTimestampAndPacketLoss(device.getDeviceID());

            // Map the data to the desired format
            List<Map<String, Object>> deviceData = healthData.stream()
                    .map(data -> {
                        Map<String, Object> entry = new HashMap<>();
                        entry.put("timestamp", (Timestamp) data[0]);
                        entry.put("packetLossRate", (Float) data[1]);
                        return entry;
                    })
                    .collect(Collectors.toList());

            // Create a result entry for the device
            Map<String, Object> deviceEntry = new HashMap<>();
            deviceEntry.put("deviceID", device.getDeviceID());
            deviceEntry.put("data", deviceData);

            // Add the device entry to the result
            result.add(deviceEntry);
        }

        return result;
    }

    public List<Map<String, Object>> getTimestampAndThroughput(Long deviceId) {
        List<Object[]> healthData =healthDao.findTimestampAndThroughput(deviceId);
        List<Map<String, Object>> result = new ArrayList<>();
        for(Object[] data :healthData){
            Map<String,Object> entry =new HashMap<>();
            entry.put("timestamp", (Timestamp)data[0]);
            entry.put("throughput",(Long)data[1]);
            result.add(entry);
        }
        return result;
    }
    public List<Map<String, Object>> getAllThroughput(List<String> deviceTypes) {
        // Fetch devices based on deviceTypes
        List<Devices> devices = ("All".equals(deviceTypes.get(0))) ? devicesDao.findAll() : devicesDao.findByDevicetypeIn(deviceTypes);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Devices device : devices) {
            // For each device, fetch timestamp and packetlossrate
            List<Object[]> healthData = healthDao.findTimestampAndThroughput(device.getDeviceID());

            // Map the data to the desired format
            List<Map<String, Object>> deviceData = healthData.stream()
                    .map(data -> {
                        Map<String, Object> entry = new HashMap<>();
                        entry.put("timestamp", (Timestamp) data[0]);
                        entry.put("throughput", (Long) data[1]);
                        return entry;
                    })
                    .collect(Collectors.toList());

            // Create a result entry for the device
            Map<String, Object> deviceEntry = new HashMap<>();
            deviceEntry.put("deviceID", device.getDeviceID());
            deviceEntry.put("data", deviceData);

            // Add the device entry to the result
            result.add(deviceEntry);
        }

        return result;
    }
    public List<Map<String, Object>> getTimestampAndLatency(Long deviceId) {
        List<Object[]> healthData =healthDao.findTimestampAndLatency(deviceId);
        List<Map<String, Object>> result = new ArrayList<>();
        for(Object[] data :healthData){
            Map<String,Object> entry =new HashMap<>();
            entry.put("timestamp", (Timestamp)data[0]);
            entry.put("latency",(Long)data[1]);
            result.add(entry);
        }
        return result;
    }
    public List<Map<String, Object>> getAllLatency(List<String> deviceTypes) {
        // Fetch devices based on deviceTypes
        List<Devices> devices = ("All".equals(deviceTypes.get(0))  ) ? devicesDao.findAll() : devicesDao.findByDevicetypeIn(deviceTypes);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Devices device : devices) {
            // For each device, fetch timestamp and packetlossrate
            List<Object[]> healthData = healthDao.findTimestampAndLatency(device.getDeviceID());

            // Map the data to the desired format
            List<Map<String, Object>> deviceData = healthData.stream()
                    .map(data -> {
                        Map<String, Object> entry = new HashMap<>();
                        entry.put("timestamp", (Timestamp) data[0]);
                        entry.put("latency", (Long) data[1]);
                        return entry;
                    })
                    .collect(Collectors.toList());

            // Create a result entry for the device
            Map<String, Object> deviceEntry = new HashMap<>();
            deviceEntry.put("deviceID", device.getDeviceID());
            deviceEntry.put("data", deviceData);

            // Add the device entry to the result
            result.add(deviceEntry);
        }

        return result;
    }
    public List<Map<String, Object>> getTimestampAndUptime(Long deviceId) {
        List<Object[]> healthData =healthDao.findTimestampAndUptime(deviceId);
        List<Map<String, Object>> result = new ArrayList<>();
        for(Object[] data :healthData){
            Map<String,Object> entry =new HashMap<>();
            entry.put("timestamp", (Timestamp)data[0]);
            entry.put("uptime",(Float)data[1]);
            result.add(entry);
        }
        return result;
    }
    public List<Map<String, Object>> getAvgUptime(List<String> deviceTypes) {
        // Fetch device IDs based on deviceTypes
        List<Long> deviceIds = ("All".equals(deviceTypes.get(0))) ? devicesDao.findAllDeviceID() : devicesDao.findDeviceIdsByDevicetypeIn(deviceTypes);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Long deviceId : deviceIds) {
            long count = healthDao.countByDeviceID(deviceId);
            Float sumUptime = healthDao.sumUptimeByDeviceID(deviceId);

            Float avgUptime = (count > 0) ? sumUptime / count : 0.0f;

            Map<String, Object> deviceEntry = new HashMap<>();
            deviceEntry.put("deviceId", deviceId);
            deviceEntry.put("avgUptime", avgUptime);
            result.add(deviceEntry);
        }
        return result;
    }

    @Autowired
    TrafficDao trafficDao;
    public ResponseEntity<List<Traffic>> getAllTraffic() {
        return  new ResponseEntity<>(trafficDao.findAll(),HttpStatus.OK);
    }
    public ResponseEntity<List<Traffic>> getDeviceTraffic(Long deviceId) {
        return new ResponseEntity<>(trafficDao.findByDeviceid(deviceId), HttpStatus.OK);
    }
    public ResponseEntity<List<Map<String, Long>>> getRtnTraffic(List<String> deviceTypes) {

        List<Devices> devices =("All".equals(deviceTypes.get(0))) ? devicesDao.findAll() :devicesDao.findByDevicetypeIn(deviceTypes);

        List<Map<String,Long>> result =devices.stream()
                .map(device ->{
                    Map<String,Long> trafficMap = new HashMap<>();
                    trafficMap.put("deviceID",device.getDeviceID());
                    trafficMap.put("inboundTraffic",device.getInboundTraffic());
                    trafficMap.put("outboundTraffic",device.getOutboundTraffic());
                    return trafficMap;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    public ResponseEntity<List<Map<String, Object>>> getAverageUptimePerDevice() {
        List<Health> healthList = healthDao.findAll();

        // Group health records by deviceID
        Map<Long, List<Health>> healthByDeviceId = healthList.stream()
                .collect(Collectors.groupingBy(Health::getDeviceID));

        // Calculate average uptime for each device
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<Long, List<Health>> entry : healthByDeviceId.entrySet()) {
            Long deviceId = entry.getKey();
            List<Health> deviceHealthList = entry.getValue();

            // Calculate average uptime for the device
            float averageUptime = calculateAverageUptime(deviceHealthList);

            // Fetch the Devices information based on deviceID
            Optional<Devices> devicesOptional = devicesDao.findById(deviceId);
            if (devicesOptional.isPresent()) {
                Devices device = devicesOptional.get();

                // Create a map for each device containing deviceID, devicetype, and average uptime
                Map<String, Object> deviceUptimeMap = new HashMap<>();
                deviceUptimeMap.put("deviceID", deviceId);
                deviceUptimeMap.put("devicetype", device.getDevicetype());
                deviceUptimeMap.put("uptime", averageUptime);

                result.add(deviceUptimeMap);
            }
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    private float calculateAverageUptime(List<Health> healthList) {
        if (healthList.isEmpty()) {
            return 0.0f;
        }

        // Calculate total uptime
        float totalUptime = healthList.stream()
                .map(Health::getUptime)
                .reduce(0.0f, Float::sum);

        // Calculate average uptime
        return totalUptime / healthList.size();
    }



}
