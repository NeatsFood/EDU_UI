import { TimeSeries } from 'pondjs';

const REFERENCE_CHANNELS = {
  tempData: { units: "deg C", label: "Temperature", format: ",.1f", series: null, show: false, type: "line" },
  RHData: { units: "percent", label: "% RH", format: ",.1f", series: null, show: false, type: "line" },
  co2Data: { units: "ppm", label: "CO2", format: "d", series: null, show: false, type: "line" },
  topTempData: { units: "deg C", label: "Top Temp", format: ",.1f", series: null, show: false, type: "line" },
  middleTempData: { units: "deg C", label: "Mid Temp", format: ",.1f", series: null, show: false, type: "line" },
  bottomTempData: { units: "deg C", label: "Bottom Temp", format: ",.1f", series: null, show: false, type: "line" },
  leafCount: { units: "", label: "Leaf Count", format: "d", series: null, show: false, type: "scatter" },
  plantHeight: { units: "cm", label: "Plant Height", format: ",.2f", series: null, show: false, type: "scatter" }
};

export default function formatTelemetryData(rawData) {
  // Initialize parameters
  const channels = {};
  let timeRange = null;

  // Get channel data
  Object.keys(rawData).forEach((channelName) => {
    const channelData = rawData[channelName];

    // Verify channel data exists
    if (channelData.length < 1) {
      return;
    };

    // Format data points
    const dataPoints = [];
    channelData.forEach((dataPoint) => {
      const date = new Date(dataPoint.time);
      dataPoints.push([date, parseFloat(dataPoint.value)]);
    });

    // Initialize channel object
    channels[channelName] = REFERENCE_CHANNELS[channelName] || { units: "", label: channelName, format: ",.1f", series: null, show: true, type: "line" };

    // Set channel display state
    channels[channelName].show = true;

    // Set channel series
    channels[channelName].series = new TimeSeries({
      name: channelName,
      columns: ["time", channelName],
      points: (channelName === "plantHeight" || channelName === "leafCount") ?
        dataPoints : dataPoints.reverse() // HACK: Backend stores data in multiple ways
    });

    // Set channel range
    channels[channelName].max = channels[channelName].series.max(channelName);
    channels[channelName].min = channels[channelName].series.min(channelName);

    // Set time range
    if (timeRange === null) {
      timeRange = channels[channelName].series.timerange()
    } else {
      timeRange = timeRange.extents(channels[channelName].series.timerange())
    }
  });

  // Successfully formatted data
  const formattedData = { channels, timeRange, ready: true };
  return formattedData;
}
